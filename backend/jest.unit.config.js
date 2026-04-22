export default {
  // Test environment
  testEnvironment: "node",

  // ESM support
  transform: {},
  transformIgnorePatterns: ["node_modules/(?!(bcrypt|jsonwebtoken)/)"],

  // Test file patterns - UNIT TESTS ONLY
  testMatch: ["**/tests/unit/**/*.test.js"],

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

  // Setup files for UNIT TESTS ONLY (no database operations)
  setupFilesAfterEnv: ["<rootDir>/tests/setup/unit.setup.js"],

  // Timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Module mapping
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
