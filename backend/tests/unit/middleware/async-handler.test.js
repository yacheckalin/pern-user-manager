import { jest } from "@jest/globals";
import asyncHandler from "../../../middleware/async-handler.js";

describe("Async Handler Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  it("should execute async function and call next on success", async () => {
    const mockFn = jest.fn().mockResolvedValue("success");
    const handler = asyncHandler(mockFn);

    await handler(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it("should catch promise rejection and call next with error", async () => {
    const error = new Error("Async operation failed");
    const mockFn = jest.fn().mockRejectedValue(error);
    const handler = asyncHandler(mockFn);

    await handler(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("should handle synchronous function that returns promise", async () => {
    const mockFn = jest.fn(() => Promise.resolve("result"));
    const handler = asyncHandler(mockFn);

    await handler(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it("should catch any error thrown in async function", async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error("Handler error"));
    const handler = asyncHandler(mockFn);

    await handler(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should pass request, response, and next to the wrapped function", async () => {
    const mockFn = jest.fn().mockResolvedValue(null);
    const handler = asyncHandler(mockFn);

    await handler(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
  });
});
