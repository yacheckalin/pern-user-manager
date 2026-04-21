import { jest } from "@jest/globals";
import {
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_UNAUTHORIZED,
  AUTH_ERRORS,
  TOKEN_ERRORS,
  USER_CODES,
  JWT_DEFAULTS,
} from "../../../constants/index.js";
import jwt from "jsonwebtoken";

jest.unstable_mockModule("../../../services/token.service.js", () => ({
  default: jest.fn().mockImplementation(() => ({
    validateWithRotate: jest.fn(),
  })),
}));

const { verifyRefreshToken, verifyAccess } = await import("../../../middleware/auth-handler.js");
const { default: RefreshTokenService } = await import("../../../services/token.service.js");

describe("Auth Handler Middleware - verifyRefreshToken", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      cookies: {},
      body: {},
      headers: { "user-agent": "Mozilla/5.0" },
      header: jest.fn((name) => req.headers[name]),
      ip: "127.0.0.1",
    };
    res = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN = "7d";
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = "30m";
    process.env.NODE_ENV = "test";
  });

  it("should throw ApiError when refresh token is missing", async () => {
    await expect(verifyRefreshToken(req, res, next)).rejects.toThrow();
  });

  it("should set user and tokens on successful validation", async () => {
    const mockResult = {
      success: true,
      data: {
        user: { id: 1, username: "testuser", email: "test@test.com", password: "hash" },
        newToken: {
          accessToken: "new-access-token",
          storedToken: {
            toJSON: () => ({ tokenHash: "new-refresh-hash" }),
          },
        },
      },
    };

    RefreshTokenService.mockImplementation(() => ({
      validateWithRotate: jest.fn().mockResolvedValue(mockResult),
    }));

    req.cookies.refreshToken = "valid-refresh-token";

    await verifyRefreshToken(req, res, next);

    expect(req.user).toEqual({
      id: 1,
      username: "testuser",
      email: "test@test.com",
      password: null,
    });
    expect(req.accessToken).toBe("new-access-token");
    expect(req.newRefreshToken).toBe("new-refresh-hash");
    expect(next).toHaveBeenCalled();
  });

  it("should set refresh token cookie on successful validation", async () => {
    const mockResult = {
      success: true,
      data: {
        user: { id: 1, username: "testuser" },
        newToken: {
          accessToken: "new-access-token",
          storedToken: {
            toJSON: () => ({ tokenHash: "new-refresh-hash" }),
          },
        },
      },
    };

    RefreshTokenService.mockImplementation(() => ({
      validateWithRotate: jest.fn().mockResolvedValue(mockResult),
    }));

    req.cookies.refreshToken = "valid-refresh-token";

    await verifyRefreshToken(req, res, next);

    expect(res.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "new-refresh-hash",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      })
    );
  });

  it("should set access token cookie on successful validation", async () => {
    const mockResult = {
      success: true,
      data: {
        user: { id: 1, username: "testuser" },
        newToken: {
          accessToken: "new-access-token",
          storedToken: {
            toJSON: () => ({ tokenHash: "new-refresh-hash" }),
          },
        },
      },
    };

    RefreshTokenService.mockImplementation(() => ({
      validateWithRotate: jest.fn().mockResolvedValue(mockResult),
    }));

    req.cookies.refreshToken = "valid-refresh-token";

    await verifyRefreshToken(req, res, next);

    expect(res.cookie).toHaveBeenCalledWith(
      "accessToken",
      "new-access-token",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      })
    );
  });

  it("should accept refresh token from body", async () => {
    const mockResult = {
      success: true,
      data: {
        user: { id: 1, username: "testuser" },
        newToken: {
          accessToken: "new-access-token",
          storedToken: {
            toJSON: () => ({ tokenHash: "new-refresh-hash" }),
          },
        },
      },
    };

    const mockService = {
      validateWithRotate: jest.fn().mockResolvedValue(mockResult),
    };
    RefreshTokenService.mockImplementation(() => mockService);

    req.body.refreshToken = "token-from-body";

    await verifyRefreshToken(req, res, next);

    expect(mockService.validateWithRotate).toHaveBeenCalledWith(
      expect.objectContaining({
        refreshToken: "token-from-body",
      })
    );
  });

  it("should throw error when validateWithRotate fails", async () => {
    const error = new Error("Token validation failed");
    RefreshTokenService.mockImplementation(() => ({
      validateWithRotate: jest.fn().mockRejectedValue(error),
    }));

    req.cookies.refreshToken = "invalid-token";

    await expect(verifyRefreshToken(req, res, next)).rejects.toThrow();
  });

  it("should set secure cookie flag in production", async () => {
    process.env.NODE_ENV = "production";

    const mockResult = {
      success: true,
      data: {
        user: { id: 1, username: "testuser" },
        newToken: {
          accessToken: "new-access-token",
          storedToken: {
            toJSON: () => ({ tokenHash: "new-refresh-hash" }),
          },
        },
      },
    };

    RefreshTokenService.mockImplementation(() => ({
      validateWithRotate: jest.fn().mockResolvedValue(mockResult),
    }));

    req.cookies.refreshToken = "valid-token";

    await verifyRefreshToken(req, res, next);

    expect(res.cookie).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        secure: true,
      })
    );
  });
});

describe("Auth Handler Middleware - verifyAccess", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      headers: {
        authorization: `Bearer ${jwt.sign(
          { auth: { id: 1, username: "testuser" } },
          process.env.JWT_ACCESS_TOKEN_SECRET || JWT_DEFAULTS.ACCESS_TOKEN_SECRET
        )}`,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it("should throw error when no authorization header", () => {
    req.headers = {};

    expect(() => verifyAccess(req, res, next)).toThrow();
  });

  it("should throw error when no Bearer token", () => {
    req.headers.authorization = "InvalidFormat";

    expect(() => verifyAccess(req, res, next)).toThrow();
  });

  it("should set req.user when token is valid", () => {
    const token = jwt.sign(
      { auth: { id: 1, username: "testuser", email: "test@test.com" } },
      process.env.JWT_ACCESS_TOKEN_SECRET || JWT_DEFAULTS.ACCESS_TOKEN_SECRET
    );
    req.headers.authorization = `Bearer ${token}`;

    verifyAccess(req, res, next);

    expect(req.user).toMatchObject({
      auth: { id: 1, username: "testuser", email: "test@test.com" },
    });
    expect(next).toHaveBeenCalled();
  });

  it("should call next when token is valid", () => {
    const token = jwt.sign(
      { auth: { id: 1 } },
      process.env.JWT_ACCESS_TOKEN_SECRET || JWT_DEFAULTS.ACCESS_TOKEN_SECRET
    );
    req.headers.authorization = `Bearer ${token}`;

    verifyAccess(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should throw error when token is expired", () => {
    const token = jwt.sign(
      { auth: { id: 1 } },
      process.env.JWT_ACCESS_TOKEN_SECRET || JWT_DEFAULTS.ACCESS_TOKEN_SECRET,
      { expiresIn: "-1h" }
    );
    req.headers.authorization = `Bearer ${token}`;

    expect(() => verifyAccess(req, res, next)).toThrow();
  });

  it("should throw error when token signature is invalid", () => {
    const token = jwt.sign(
      { auth: { id: 1 } },
      "wrong-secret"
    );
    req.headers.authorization = `Bearer ${token}`;

    expect(() => verifyAccess(req, res, next)).toThrow();
  });

  it("should extract token from Bearer scheme", () => {
    const token = jwt.sign(
      { auth: { id: 1, username: "user" } },
      process.env.JWT_ACCESS_TOKEN_SECRET || JWT_DEFAULTS.ACCESS_TOKEN_SECRET
    );
    req.headers.authorization = `Bearer ${token}`;

    verifyAccess(req, res, next);

    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
});
