import { jest } from "@jest/globals";
import {
  AUTH_ERRORS,
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_OK,
  HTTP_UNAUTHORIZED,
} from "../../../constants/index.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

jest.unstable_mockModule("../../../services/auth.service.js", () => ({
  default: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    logout: jest.fn(),
  })),
}));

jest.unstable_mockModule("../../../services/token.service.js", () => ({
  default: jest.fn().mockImplementation(() => ({
    createToken: jest.fn(),
  })),
}));
const { default: AuthService } =
  await import("../../../services/auth.service.js");
const { default: TokenService } =
  await import("../../../services/token.service.js");

const { default: AuthController } =
  await import("../../../controllers/auth.controller.js");

describe("AuthController - Unit Tests", () => {
  let authController;
  let mockAuthService;
  let req, res, next, realToken;
  const mockUser = {
    id: "3",
    username: "test1",
    email: "test1@tt.tt",
    age: 18,
    isActive: false,
    createdAt: "2026-04-08T07:08:00.823Z",
    updatedAt: "2026-04-08T07:08:00.823Z",
    activatedAt: null,
    lastLogin: null,
  };

  const secret =
    process.env.JWT_ACCESS_TOKEN_SECRET || JWT_DEFAULTS.ACCESS_TOKEN_SECRET;
  beforeEach(() => {
    jest.clearAllMocks();
    realToken = jwt.sign(
      {
        auth: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
        },
      },
      secret,
    );
    mockAuthService = {
      login: jest.fn().mockResolvedValue({
        accessToken: realToken,
        refreshToken: "refresh-token",
        storedToken: { id: 1, tokenHash: "some-mock-hash" },
        user: mockUser,
      }),
      logout: jest.fn(),
    };

    AuthService.mockImplementation(() => mockAuthService);
    TokenService.mockImplementation(() => mockTokenService);

    authController = new AuthController();

    // Mock request and response
    req = {
      params: {},
      body: {},
      query: {},
      ip: "127.0.0.1",
      headers: { "user-agent": "jest-test" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe("login", () => {
    it("should return user on successful login", async () => {
      const payload = {
        data: { email: "test@test.com", password: "123" },
        accessToken: realToken,
        success: true,
      };
      req.body = payload;
      req.ip = "127.0.0.1";

      mockAuthService.login.mockResolvedValue({
        accessToken: realToken,
        refreshToken: "mock-rt",
        storedToken: {
          id: 1,
          tokenHash: "some-hash",
        },
        user: mockUser,
      });

      await authController.login(req, res, next);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        expect.objectContaining(req.body),
      );

      expect(res.cookie).toHaveBeenCalledWith(
        "accessToken",
        realToken,
        expect.any(Object),
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "refreshToken",
        "some-hash",
        expect.any(Object),
      );
      expect(res.status).toHaveBeenCalledWith(HTTP_OK);
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle INVALID_USERNAME_OR_EMAIL error", async () => {
      const payload = { email: "wrong@test.com", password: "wrong" };
      req.body = payload;
      req.ip = "127.0.0.1";
      req.headers["user-agent"] = "jest-test";
      const error = new Error(AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL);
      mockAuthService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        expect.objectContaining({
          email: payload.email,
          ip: "127.0.0.1",
          userAgent: "jest-test",
        }),
      );
      expect(next).toHaveBeenCalledWith({
        message: AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL,
        statusCode: HTTP_BAD_REQUEST,
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle INVALID_USERNAME error", async () => {
      const payload = { email: "wrong@test.com", password: "wrong" };
      req.body = payload;
      req.ip = "127.0.0.1";
      req.headers["user-agent"] = "jest-test";
      const error = new Error(AUTH_ERRORS.INVALID_USERNAME);
      mockAuthService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        expect.objectContaining({
          email: payload.email,
          ip: "127.0.0.1",
          userAgent: "jest-test",
        }),
      );
      expect(next).toHaveBeenCalledWith({
        message: AUTH_ERRORS.INVALID_USERNAME,
        statusCode: HTTP_BAD_REQUEST,
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle INVALID_EMAIL error", async () => {
      const payload = { email: "wrong@test.com", password: "wrong" };
      req.body = payload;
      req.ip = "127.0.0.1";
      req.headers["user-agent"] = "jest-test";
      const error = new Error(AUTH_ERRORS.INVALID_EMAIL);
      mockAuthService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        expect.objectContaining({
          email: payload.email,
          ip: "127.0.0.1",
          userAgent: "jest-test",
        }),
      );
      expect(next).toHaveBeenCalledWith({
        message: AUTH_ERRORS.INVALID_EMAIL,
        statusCode: HTTP_BAD_REQUEST,
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle INVALID_PASSWORD error", async () => {
      const payload = { email: "wrong@test.com", password: "wrong" };
      req.body = payload;
      req.ip = "127.0.0.1";
      req.headers["user-agent"] = "jest-test";
      const error = new Error(AUTH_ERRORS.INVALID_PASSWORD);
      mockAuthService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        expect.objectContaining({
          email: payload.email,
          ip: "127.0.0.1",
          userAgent: "jest-test",
        }),
      );
      expect(next).toHaveBeenCalledWith({
        message: AUTH_ERRORS.INVALID_PASSWORD,
        statusCode: HTTP_BAD_REQUEST,
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle INVALID_CRIDENTIALS error", async () => {
      const payload = { email: "wrong@test.com", password: "wrong" };
      req.body = payload;
      req.ip = "127.0.0.1";
      req.headers["user-agent"] = "jest-test";
      const error = new Error(AUTH_ERRORS.INVALID_CRIDENTIALS);
      mockAuthService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        expect.objectContaining({
          email: payload.email,
          ip: "127.0.0.1",
          userAgent: "jest-test",
        }),
      );
      expect(next).toHaveBeenCalledWith({
        message: AUTH_ERRORS.INVALID_CRIDENTIALS,
        statusCode: HTTP_UNAUTHORIZED,
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle unexpected errors with 500 status", async () => {
      const payload = { email: "wrong@test.com", password: "wrong" };
      req.body = payload;
      req.ip = "127.0.0.1";
      req.headers["user-agent"] = "jest-test";
      const error = new Error("Unexpected error");
      mockAuthService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        expect.objectContaining({
          email: payload.email,
          ip: "127.0.0.1",
          userAgent: "jest-test",
        }),
      );
      expect(next).toHaveBeenCalledWith({
        message: "Unexpected error",
        statusCode: HTTP_INTERNAL_SERVER_ERROR,
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should logout properly", async () => {
      req.user = { id: 3 };
      req.ip = "127.0.0.1";
      req.headers["user-agent"] = "jest-test";
      req.cookies = { refreshToken: "mock-refresh-token" };
      req.refreshToken = "mock-refresh-token";

      mockAuthService.logout.mockResolvedValue({
        userId: 1,
        tokenHash: "mock-refresh-token",
      });

      await authController.logout(req, res, next);

      expect(mockAuthService.logout).toHaveBeenCalledWith({
        tokenHash: "mock-refresh-token",
        userId: 3,
      });
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_OK);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        }),
      );
    });

    it("should not logout when user.id is not provided", async () => {
      req.cookies = { refreshToken: "mock-refresh-token" };
      req.refreshToken = "mock-refresh-token";

      mockAuthService.logout.mockResolvedValue(true);

      await authController.logout(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
