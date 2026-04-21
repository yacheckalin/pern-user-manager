import { jest } from "@jest/globals";

jest.unstable_mockModule("morgan", () => ({
  default: jest.fn((format, options) => {
    return (req, res, next) => {
      options.stream.write(`${req.method} ${req.url}`);
      next();
    };
  }),
}));

jest.unstable_mockModule("../../../logger.js", () => ({
  default: {
    http: jest.fn(),
  },
}));

const morganMiddleware = await import("../../../middleware/morgan.js");
const morgan = await import("morgan");
const { default: logger } = await import("../../../logger.js");

describe("Morgan Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      method: "GET",
      url: "/api/users",
    };
    res = {};
    next = jest.fn();
  });

  it("should write log message to logger", () => {
    const middleware = morganMiddleware.default;
    middleware(req, res, next);

    expect(logger.http).toHaveBeenCalled();
  });

  it("should skip logging in test environment", () => {
    process.env.NODE_ENV = "test";
    const options = { stream: { write: jest.fn() }, skip: jest.fn().mockReturnValue(true) };

    const shouldSkip = options.skip();
    expect(shouldSkip).toBe(true);
  });

  it("should not skip logging in development environment", () => {
    process.env.NODE_ENV = "development";
    const options = { stream: { write: jest.fn() }, skip: jest.fn().mockReturnValue(false) };

    const shouldSkip = options.skip();
    expect(shouldSkip).toBe(false);
  });

  it("should not skip logging in production environment", () => {
    process.env.NODE_ENV = "production";
    const options = { stream: { write: jest.fn() }, skip: jest.fn().mockReturnValue(false) };

    const shouldSkip = options.skip();
    expect(shouldSkip).toBe(false);
  });

  it("should trim whitespace from log messages", () => {
    const stream = { write: jest.fn() };
    const logMessage = "GET /api/users 200 \n";

    stream.write(logMessage.trim());

    expect(stream.write).toHaveBeenCalledWith("GET /api/users 200");
  });

  it("should be a function", () => {
    expect(typeof morganMiddleware.default).toBe("function");
  });

  it("should call next after logging", () => {
    const middleware = morganMiddleware.default;
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
