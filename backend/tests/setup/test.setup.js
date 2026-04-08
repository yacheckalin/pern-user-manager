import dotenv from "dotenv";
import { jest } from "@jest/globals";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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
  "DB_CONNECTION",
  "DB_PORT",
  "DB_USERNAME",
  "DB_NAME",
  "DB_PASSWORD",
  "DB_CONNECTION",
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
