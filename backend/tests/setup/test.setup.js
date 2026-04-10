import dotenv from "dotenv";
import { jest } from "@jest/globals";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Pool } from "pg";

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
  const envFiles = [
    { path: path.join(projectRoot, ".env.test"), required: false },
    { path: path.join(projectRoot, ".env.test.local"), required: false },
    { path: path.join(projectRoot, ".env"), required: false },
  ];

  for (const envFile of envFiles) {
    if (fs.existsSync(envFile.path)) {
      const result = dotenv.config({ path: envFile.path });
      if (result.error) {
        console.warn(`Warning: Error loading ${envFile.path}`, result.error);
      } else {
        console.log(`✅ Loaded: ${path.basename(envFile.path)}`);
      }
    }
  }
};

loadEnvFiles();

// Validate required environment variables for tests
const requiredEnvVars = [
  "TEST_DB_PORT",
  "TEST_DB_USERNAME",
  "TEST_DB_NAME",
  "TEST_DB_PASSWORD",
  "TEST_DB_CONNECTION",
  "TEST_DB_URL",
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName],
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}\n` +
      "Make sure .env.test or .env.test.local exists with these values.",
  );
}

// ============================================
// 2. OVERRIDE ENVIRONMENT
// ============================================

// Ensure NODE_ENV is 'test'
process.env.NODE_ENV = "test";

// Set test-specific defaults (can be overridden by .env.test.local)
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "error";
process.env.RATE_LIMIT_ENABLED = process.env.RATE_LIMIT_ENABLED || "false";

// Create unique test database name if not specified
if (
  !process.env.DB_NAME ||
  process.env.DB_NAME.includes("dev") ||
  process.env.DB_NAME.includes("prod")
) {
  const uniqueDbName = `test_${crypto.randomBytes(8).toString("hex")}`;
  process.env.DB_NAME = uniqueDbName;
  console.log(`🔨 Using unique test database: ${uniqueDbName}`);
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
    warn: console.warn,
    error: console.error,
  };
}

// Mock date if configured
if (process.env.MOCK_DATE === "true") {
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
    testPool = new Pool({
      host: process.env.TEST_DB_CONNECTION,
      port: parseInt(process.env.TEST_DB_PORT, 10),
      database: process.env.TEST_DB_NAME,
      user: process.env.TEST_DB_USERNAME,
      password: process.env.TEST_DB_PASSWORD,
      max: 5,
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT, 10) || 10000,
      connectionTimeoutMillis:
        parseInt(process.env.DB_CONNECTION_TIMEOUT) || 5000,
    });
  }
  return testPool;
};

export const clearTestDatabase = async () => {
  try {
    const pool = getTestPool();

    // Get all tables in app schema
    const { rows } = await pool.query(`
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = 'app'
        `);

    // Truncate all tables in reverse order
    for (const row of rows.reverse()) {
      await pool.query(`TRUNCATE TABLE app.${row.tablename} CASCADE`);
    }

    // Reset sequences
    const { rows: sequences } = await pool.query(`
            SELECT sequence_name
            FROM information_schema.sequences
            WHERE sequence_schema = 'app'
        `);

    for (const seq of sequences) {
      await pool.query(
        `ALTER SEQUENCE app.${seq.sequence_name} RESTART WITH 1`,
      );
    }
  } catch (error) {
    // Silently skip DB clearing for unit tests that don't have a database
    if (!error.message.includes("ENOTFOUND")) {
      console.error("Error clearing test database:", error);
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

    console.log(`💾 Keeping test database: ${process.env.TEST_DB_NAME}`);
    await testPool.end();
    testPool = null;
  }
};

// ============================================
// 5. GLOBAL SETUP/TEARDOWN
// ============================================

// Global before all tests
beforeAll(async () => {
  // Only validate DB connection for integration and e2e tests
  // Unit tests don't require a real database
  const testPathPattern = process.env.JEST_WORKER_ID
    ? null
    : process.argv.join(" ");
  const isUnitTest = testPathPattern && testPathPattern.includes("tests/unit");

  if (!isUnitTest) {
    const pool = getTestPool();
    try {
      await pool.query("SELECT 1");
      console.log(`✅ Test database connected: ${process.env.TEST_DB_NAME}`);
    } catch (error) {
      console.warn(`⚠️  Could not connect to test database: ${error.message}`);
    }

    // Run migrations if needed
    if (process.env.RUN_MIGRATIONS === "true") {
      const { execSync } = await import("child_process");
      try {
        execSync("npm run migrate:up", { stdio: "inherit" });
        console.log("✅ Migrations completed");
      } catch (error) {
        console.error("Migration failed:", error.message);
      }
    }
  }
});

// Reset before each test
beforeEach(async () => {
  await clearTestDatabase();
  jest.clearAllMocks();
  jest.resetModules();
});

// Cleanup after all tests
afterAll(async () => {
  await closeTestDatabase();

  if (process.env.MOCK_DATE === "true") {
    jest.useRealTimers();
  }

  console.log("✅ Test setup cleanup complete");
});

// ============================================
// 6. EXPORT ALL UTILITIES
// ============================================

export const getTestConfig = () => ({
  dbHost: process.env.TEST_DB_CONNECTION,
  dbPort: process.env.TEST_DB_PORT,
  dbName: process.env.TEST_DB_NAME,
  dbUserName: process.env.TEST_DB_USERNAME,
  dbPassword: process.env.TEST_DB_PASSWORD,
  dbUrl: process.env.TEST_DB_URL,
  logLevel: process.env.LOG_LEVEL,
});

export default {
  getTestPool,
  clearTestDatabase,
  closeTestDatabase,
  getTestConfig,
};
