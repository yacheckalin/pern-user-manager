export default {
  // Test environment
  testEnvironment: "node",

  // ESM support
  transform: {},
  transformIgnorePatterns: ["node_modules/(?!(bcrypt|jsonwebtoken)/)"],

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
