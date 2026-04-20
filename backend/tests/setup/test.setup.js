import dotenv from "dotenv";
import { jest } from "@jest/globals";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Pool } from "pg";
import database from "../../config/database.js";
import logger from '../../logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

// ============================================
// 1. LOAD ENVIRONMENT VARIABLES (PRIORITY ORDER)
// ============================================

// Load order (later files override earlier ones):
// 1. .env.test (base test config - committed)
// 2. .env.test.local (local overrides - gitignored)
// 3. .env (fallback - if exists)

const loadEnvFiles = () => {
  const envFiles = [".env", ".env.test", ".env.test.local"];

  envFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      dotenv.config({ path: filePath });
      logger.info(`✅ Loaded from file: ${file}`);
    }
  });

  const requiredVars = ['DB_PORT', 'DB_USERNAME', 'DB_NAME', 'DB_PASSWORD'];
  const missing = requiredVars.filter(v => !process.env[v]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
};

loadEnvFiles();

// ============================================
// 2. OVERRIDE ENVIRONMENT
// ============================================

// Ensure NODE_ENV is 'test'
process.env.NODE_ENV = "test";

// Set test-specific defaults (can be overridden by .env.test.local)
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "error";
process.env.RATE_LIMIT_ENABLED = process.env.RATE_LIMIT_ENABLED || "false";

const testArgs = process.argv.join(" ");
const isIntegrationTest = testArgs.includes("tests/integration");
const isE2eTest = testArgs.includes("tests/e2e");

// Create unique test database name if not specified
if (
  !process.env.DB_NAME ||
  process.env.DB_NAME.includes("dev") ||
  process.env.DB_NAME.includes("prod")
) {
  const uniqueDbName = `test_${crypto.randomBytes(8).toString("hex")}`;
  process.env.DB_NAME = uniqueDbName;
  logger.info(`🔨 Using unique test database: ${uniqueDbName}`);
}

// ============================================
// 3. GLOBAL TEST CONFIGURATION
// ============================================

// Suppress console logs during tests (unless DEBUG is true)
if (process.env.LOG_LEVEL === "error" && !process.env.DEBUG_TESTS) {
  global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    warn: logger.warn,
    error: logger.error,
  };
}

// Mock date if configured for unit tests only
if (process.env.MOCK_DATE === "true" && !isIntegrationTest && !isE2eTest) {
  const MOCK_DATE = new Date("2024-01-01T00:00:00.000Z");
  jest.useFakeTimers();
  jest.setSystemTime(MOCK_DATE);
}

// Export common test utilities
export const testUtils = {
  wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  randomString: (length = 10) => {
    return Math.random()
      .toString(36)
      .substring(2, length + 2);
  },

  randomEmail: () => {
    return `test_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`;
  },

  randomNumber: (min = 1, max = 1000) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  cloneObject: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },

  expectError: async (fn, expectedMessage) => {
    try {
      await fn();
      throw new Error("Expected function to throw");
    } catch (error) {
      if (expectedMessage) {
        expect(error.message).toContain(expectedMessage);
      }
      return error;
    }
  },
};

// ============================================
// 4. DATABASE HELPERS
// ============================================

let testPool = null;
let keepDatabase = process.env.KEEP_TEST_DATABASE === "true";

export const getTestPool = () => {
  if (!testPool) {
    const dbConfig = process.env.DATABASE_URL ?
      { connectionString: process.env.DATABASE_URL } : {
        host: process.env.DB_HOST || process.env.DB_CONNECTION,
        port: parseInt(process.env.DB_PORT, 10),
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        max: 5,
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT, 10) || 1000,
        connectionTimeoutMillis:
          parseInt(process.env.DB_CONNECTION_TIMEOUT) || 5000,
      }
    testPool = new Pool(dbConfig);
  }
  return testPool;
};

export const clearTestDatabase = async () => {
  try {
    const pool = getTestPool();
    logger.info("🔄 Clearing test database...");

    // Get all tables in app schema
    const { rows } = await pool.query({
      text: `
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = 'app'
        `,
      statement_timeout: 5000,
    });

    // Truncate all tables in reverse order
    for (const row of rows.reverse()) {
      await pool.query({
        text: `TRUNCATE TABLE app.${row.tablename} CASCADE`,
        statement_timeout: 5000,
      });
    }

    // Reset sequences
    const { rows: sequences } = await pool.query({
      text: `
            SELECT sequence_name
            FROM information_schema.sequences
            WHERE sequence_schema = 'app'
        `,
      statement_timeout: 5000,
    });

    for (const seq of sequences) {
      await pool.query({
        text: `ALTER SEQUENCE app.${seq.sequence_name} RESTART WITH 1`,
        statement_timeout: 5000,
      });
    }

    logger.info("✅ Test database cleared");
  } catch (error) {
    // Silently skip DB clearing for unit tests that don't have a database
    if (!error.message.includes("ENOTFOUND")) {
      logger.error("Error clearing test database:", error);
      throw error;
    }
  }
};

export const closeTestDatabase = async () => {
  if (testPool) {
    if (!keepDatabase) {
      // Do not drop the shared Docker test database here.
      // The DB is already isolated in Docker, and dropping it per test file
      // causes the next test suite to fail when it connects.
      await testPool.end();
      testPool = null;
      return;
    }

    logger.info(`💾 Keeping test database: ${process.env.DB_NAME}`);
    await testPool.end();
    testPool = null;
  }
};

// ============================================
// 5. GLOBAL SETUP/TEARDOWN
// ============================================

// Global before all tests
beforeAll(async () => {
  const testArgs = process.argv.join(" ");
  const isUnitTest = testArgs.includes("tests/unit");
  const isIntegrationTest = testArgs.includes("tests/integration");
  const isE2eTest = testArgs.includes("tests/e2e");

  if (isIntegrationTest || isE2eTest) {
    const pool = getTestPool();
    try {
      await pool.query("SELECT 1");
      logger.info(`✅ Test database connected: ${process.env.DB_NAME}`);
    } catch (error) {
      logger.warn(`⚠️  Could not connect to test database: ${error.message}`);
    }

    // Run migrations if needed
    if (process.env.RUN_MIGRATIONS === "true") {
      const { execSync } = await import("child_process");
      try {
        execSync("npm run migrate:up", { stdio: "inherit" });
        logger.info("✅ Migrations completed");
      } catch (error) {
        logger.error("Migration failed:", error.message);
      }
    }
  }
});

// Reset before each test
beforeEach(async () => {
  const testArgs = process.argv.join(" ");
  const isIntegrationTest = testArgs.includes("tests/integration");
  const isE2eTest = testArgs.includes("tests/e2e");

  if (!isIntegrationTest && !isE2eTest) {
    await clearTestDatabase();
  }

  jest.clearAllMocks();
  jest.resetModules();
});

// Cleanup after all tests
afterAll(async () => {
  await closeTestDatabase();

  if (database && typeof database.end === "function") {
    await database.end();
  }

  if (process.env.MOCK_DATE === "true") {
    jest.useRealTimers();
  }

  logger.info("✅ Test setup cleanup complete");
});

// ============================================
// 6. EXPORT ALL UTILITIES
// ============================================

export const getTestConfig = () => (process.env.DATABASE_URL ?
  { connectionString: process.env.DATABASE_URL } : {
    dbHost: process.env.DB_CONNECTION || process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    dbUserName: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbUrl: process.env.DB_URL,
    logLevel: process.env.LOG_LEVEL,
  });

export default {
  getTestPool,
  clearTestDatabase,
  closeTestDatabase,
  getTestConfig,
};
