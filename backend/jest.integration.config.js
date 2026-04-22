export default {
  // Test environment
  testEnvironment: "node",

  // ESM support
  transform: {},
  transformIgnorePatterns: ["node_modules/(?!(bcrypt|jsonwebtoken)/)"],

  // Test file patterns - INTEGRATION TESTS ONLY
  testMatch: ["**/tests/integration/**/*.test.js"],

  // Roots
  roots: ["<rootDir>/tests"],

  // Coverage
  collectCoverageFrom: [
    "<rootDir>/**/*.js",
    "<rootDir>/app.js",
    "<rootDir>/config/**",
    "<rootDir>/constants/**",
    "<rootDir>/controllers/**",
    "<rootDir>/middleware/**",
    "<rootDir>/errors/**",
    "<rootDir>/models/**",
    "<rootDir>/repositories/**",
    "<rootDir>/services/**",
    "<rootDir>/routes/**",
    "<rootDir>/schemas/**",
    "<rootDir>/utils/**",
    "!**/node_modules/**",
    "!**/tests/**",
    "!**/vendor/**",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/tests/",
    "<rootDir>/config/",
    "<rootDir>/migrations/",
    "<rootDir>/tests/global.setup.js",
    "<rootDir>/tests/global.teardown.js",
    "<rootDir>/package.json",
    "<rootDir>/package-lock.json",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],

  // Setup files for INTEGRATION TESTS (with database operations)
  setupFilesAfterEnv: ["<rootDir>/tests/setup/test.setup.js"],

  // Timeout - needs to be high for beforeAll database connection retries
  testTimeout: 3000,

  // Verbose output
  verbose: true,

  // Module mapping
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // Run tests serially for integration tests
  maxWorkers: 1,
};
