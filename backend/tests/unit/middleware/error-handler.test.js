import { jest } from "@jest/globals";
import { HTTP_INTERNAL_SERVER_ERROR, SERVER_ERROR } from "../../../constants/index.js";
import ApiError from "../../../errors/api.error.js";

jest.unstable_mockModule("../../../logger.js", () => ({
  default: {
    error: jest.fn(),
  },
}));

const { default: errorHandler } = await import("../../../middleware/error-handler.js");
const { default: logger } = await import("../../../logger.js");

describe("Error Handler Middleware", () => {
  let req, res, next, err;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      path: "/test",
      method: "GET",
      headers: { "x-request-id": "test-123" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    process.env.NODE_ENV = "production";
    process.env.LOG_LEVEL = "info";
  });

  it("should handle ApiError with toJSON method", () => {
    err = new ApiError({
      message: "Test error",
      code: "TEST_ERROR",
      status: 400,
    });

    errorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );
  });

  it("should convert regular Error to ApiError", () => {
    err = new Error("Regular error");

    errorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HTTP_INTERNAL_SERVER_ERROR);
  });

  it("should log error with request metadata", () => {
    err = new Error("Test error");
    req.headers["x-request-id"] = "req-456";

    errorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalledWith(
      "[Error] Test error",
      expect.objectContaining({
        path: "/test",
        method: "GET",
        requestId: "req-456",
      })
    );
  });

  it("should include stack trace in development environment", () => {
    process.env.NODE_ENV = "development";
    err = new Error("Dev error");

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stack: expect.any(String),
      })
    );
  });

  it("should include stack trace when LOG_LEVEL is debug", () => {
    process.env.LOG_LEVEL = "debug";
    err = new Error("Debug error");

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stack: expect.any(String),
      })
    );
  });

  it("should not include stack trace in production", () => {
    process.env.NODE_ENV = "production";
    process.env.LOG_LEVEL = "info";
    err = new Error("Prod error");

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.not.objectContaining({
        stack: expect.anything(),
      })
    );
  });

  it("should handle errors without toJSON method", () => {
    err = { message: "Custom error object", status: 403 };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalled();
  });

  it("should use default HTTP_INTERNAL_SERVER_ERROR when status is missing", () => {
    err = new Error("No status error");

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(HTTP_INTERNAL_SERVER_ERROR);
  });

  it("should handle errors with custom details", () => {
    err = new ApiError({
      message: "Detailed error",
      code: "DETAIL_CODE",
      status: 422,
      details: "Additional information",
    });

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );
  });
});
