import { HTTP_INTERNAL_SERVER_ERROR, SERVER_ERROR } from "../../../constants/index.js";
import ApiError from "../../../errors/api.error.js";

describe("ApiError Class", () => {
  it("should create ApiError with message", () => {
    const error = new ApiError({ message: "Test error" });

    expect(error.message).toBe("Test error");
    expect(error.status).toBe(HTTP_INTERNAL_SERVER_ERROR);
    expect(error.code).toBe("");
    expect(error.details).toBe("");
    expect(error.name).toBe("ApiError");
  });

  it("should create ApiError with custom status", () => {
    const error = new ApiError({
      message: "Not found",
      status: 404,
    });

    expect(error.status).toBe(404);
    expect(error.message).toBe("Not found");
  });

  it("should create ApiError with code and details", () => {
    const error = new ApiError({
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      status: 400,
      details: "Email format is invalid",
    });

    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.details).toBe("Email format is invalid");
  });

  it("should use default message when not provided", () => {
    const error = new ApiError({ status: 500 });

    expect(error.message).toBe(SERVER_ERROR.INTERNAL_SERVER_ERROR);
  });

  it("should coerce string status to number", () => {
    const error = new ApiError({
      message: "Error",
      status: "403",
    });

    expect(error.status).toBe(403);
    expect(typeof error.status).toBe("number");
  });

  it("should use default status when invalid status provided", () => {
    const error = new ApiError({
      message: "Error",
      status: "invalid",
    });

    expect(error.status).toBe(HTTP_INTERNAL_SERVER_ERROR);
  });

  it("should extend Error class", () => {
    const error = new ApiError({ message: "Test" });

    expect(error instanceof Error).toBe(true);
    expect(error instanceof ApiError).toBe(true);
  });

  it("should have toJSON method", () => {
    const error = new ApiError({
      message: "JSON test",
      code: "JSON_CODE",
      status: 400,
      details: "Details here",
    });

    const json = error.toJSON();

    expect(json).toEqual({
      message: "JSON test",
      code: "JSON_CODE",
      status: 400,
      details: "Details here",
    });
  });

  it("should have stack trace", () => {
    const error = new ApiError({ message: "Stack test" });

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
    expect(error.stack).toContain("ApiError");
  });

  it("should handle empty configuration object", () => {
    const error = new ApiError({});

    expect(error.message).toBe(SERVER_ERROR.INTERNAL_SERVER_ERROR);
    expect(error.status).toBe(HTTP_INTERNAL_SERVER_ERROR);
    expect(error.code).toBe("");
    expect(error.details).toBe("");
  });

  it("should handle null configuration", () => {
    const error = new ApiError();

    expect(error.message).toBe(SERVER_ERROR.INTERNAL_SERVER_ERROR);
    expect(error.status).toBe(HTTP_INTERNAL_SERVER_ERROR);
  });

  it("should preserve error properties when converting to JSON", () => {
    const error = new ApiError({
      message: "Test error",
      code: "TEST_CODE",
      status: 422,
    });

    const json = error.toJSON();
    const recovered = new ApiError(json);

    expect(recovered.message).toBe("Test error");
    expect(recovered.code).toBe("TEST_CODE");
  });
});
