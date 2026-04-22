import dotenv from "dotenv";
import { jest } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import logger from '../../logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

// ============================================
// 1. LOAD ENVIRONMENT VARIABLES
// ============================================

const loadEnvFiles = () => {
  const envFiles = [".env", ".env.test", ".env.test.local"];

  envFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      dotenv.config({ path: filePath });
      logger.info(`✅ Loaded from file: ${file}`);
    }
  });
};

loadEnvFiles();

// ============================================
// 2. OVERRIDE ENVIRONMENT FOR UNIT TESTS
// ============================================

// Ensure NODE_ENV is 'test'
process.env.NODE_ENV = "test";

// Set test-specific defaults
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "error";
process.env.RATE_LIMIT_ENABLED = process.env.RATE_LIMIT_ENABLED || "false";

// ============================================
// 3. GLOBAL TEST CONFIGURATION
// ============================================

// Suppress console logs during unit tests (unless DEBUG is true)
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

// Mock date if configured for unit tests
if (process.env.MOCK_DATE === "true") {
  const MOCK_DATE = new Date("2024-01-01T00:00:00.000Z");
  jest.useFakeTimers();
  jest.setSystemTime(MOCK_DATE);
}

// ============================================
// 5. GLOBAL SETUP/TEARDOWN (NO DATABASE OPERATIONS)
// ============================================

// Reset before each test (no database clearing for unit tests)
beforeEach(async () => {
  jest.clearAllMocks();
  jest.resetModules();
});

// Cleanup after all tests
afterAll(async () => {
  if (process.env.MOCK_DATE === "true") {
    jest.useRealTimers();
  }

  logger.info("✅ Unit test cleanup complete");
});

