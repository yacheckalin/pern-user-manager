import { jest } from "@jest/globals";
import { HTTP_BAD_REQUEST } from "../../../constants/http.constants.js";
import { validate } from "../../../middleware/validation.js";
import ApiError from "../../../errors/api.error.js";

describe("Validation Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it("should call next when validation passes", () => {
    const schema = {
      validate: jest.fn().mockReturnValue({
        error: null,
        value: { username: "testuser", email: "test@test.com" },
      }),
    };

    req.body = { username: "testuser", email: "test@test.com" };
    const middleware = validate(schema);
    middleware(req, res, next);

    expect(schema.validate).toHaveBeenCalled();
    expect(req.validatedData).toEqual({ username: "testuser", email: "test@test.com" });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return error response when validation fails", () => {
    const error = {
      statusCode: HTTP_BAD_REQUEST,
      details: [{ message: "username is required" }],
      stack: "Error stack trace",
    };
    const schema = {
      validate: jest.fn().mockReturnValue({
        error,
        value: null,
      }),
    };

    req.body = { email: "test@test.com" };
    process.env.NODE_ENV = "development";
    const middleware = validate(schema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const callArg = next.mock.calls[0][0];
    expect(callArg.message).toBe("username is required");
    expect(callArg.status).toBe(HTTP_BAD_REQUEST);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should use HTTP_BAD_REQUEST when statusCode is not provided", () => {
    const error = {
      details: [{ message: "Invalid email" }],
      stack: "Error stack trace",
    };
    const schema = {
      validate: jest.fn().mockReturnValue({
        error,
        value: null,
      }),
    };

    req.body = { email: "invalid" };
    const middleware = validate(schema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const callArg = next.mock.calls[0][0];
    expect(callArg.message).toBe("Invalid email");
    expect(callArg.status).toBe(HTTP_BAD_REQUEST);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should not include trace in production environment", () => {
    const error = {
      statusCode: HTTP_BAD_REQUEST,
      details: [{ message: "Validation error" }],
      stack: "Error stack trace",
    };
    const schema = {
      validate: jest.fn().mockReturnValue({
        error,
        value: null,
      }),
    };

    process.env.NODE_ENV = "production";
    process.env.LOG_LEVEL = "info";
    req.body = {};
    const middleware = validate(schema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const callArg = next.mock.calls[0][0];
    expect(callArg.message).toBe("Validation error");
    expect(callArg.status).toBe(HTTP_BAD_REQUEST);
    expect(callArg.details).toBe("");
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should merge params, body, and query data for validation", () => {
    const schema = {
      validate: jest.fn().mockReturnValue({
        error: null,
        value: { id: "1", username: "test", sort: "asc" },
      }),
    };

    req.params = { id: "1" };
    req.body = { username: "test" };
    req.query = { sort: "asc" };

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(schema.validate).toHaveBeenCalledWith({
      id: "1",
      username: "test",
      sort: "asc",
    });
  });
});
