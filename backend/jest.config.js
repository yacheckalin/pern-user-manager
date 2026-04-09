export default {
  // Test environment
  testEnvironment: "node",

  // Test file patterns
  testMatch: [
    "**/tests/unit/**/*.test.js",
    "**/tests/integration/**/*.test.js",
    "**/tests/e2e/**/*.test.js",
  ],

  // Roots
  roots: ["<rootDir>/tests"],

  // Coverage
  collectCoverageFrom: [
    "<rootDir>/**/*.js",
    "!<rootDir>/app.js",
    "!<rootDir>/config/**",
    "!<rootDir>/constants/**",
    "!<rootDir>/controllers/**",
    "!<rootDir>/middleware/**",
    "!<rootDir>/models/**",
    "!<rootDir>/repositories/**",
    "!<rootDir>/services/**",
    "!<rootDir>/routes/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/tests/setup/test.setup.js"],

  // Timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Module mapping
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
