import { jest } from "@jest/globals";
import {
  AUTH_ERRORS,
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_OK,
  HTTP_UNAUTHORIZED,
  USER_MESSAGES,
} from "../../../constants/index.js";

jest.unstable_mockModule("../../../services/auth.service.js", () => ({
  default: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
  })),
}));
const { default: AuthService } =
  await import("../../../services/auth.service.js");
const { default: AuthController } =
  await import("../../../controllers/auth.controller.js");

describe("AuthController - Unit Tests", () => {
  let authController;
  let mockAuthService;
  let req, res, next;

  beforeEach(() => {
    mockAuthService = {
      login: jest.fn(),
    };

    AuthService.mockImplementation(() => mockAuthService);
    authController = new AuthController();

    // Mock request and response
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

  describe("login", () => {
    it("should return user on successful login", async () => {
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

      mockAuthService.login.mockResolvedValue(mockUser);

      await authController.login(req, res, next);

      expect(mockAuthService.login).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(HTTP_OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: USER_MESSAGES.AUTHORIZED,
        data: mockUser,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle INVALID_USERNAME_OR_EMAIL error", async () => {
      const error = new Error(AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL);
      mockAuthService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(mockAuthService.login).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith({
        message: AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL,
        statusCode: HTTP_BAD_REQUEST,
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle INVALID_USERNAME error", async () => {
      const error = new Error(AUTH_ERRORS.INVALID_USERNAME);
      mockAuthService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(mockAuthService.login).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith({
        message: AUTH_ERRORS.INVALID_USERNAME,
        statusCode: HTTP_BAD_REQUEST,
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle INVALID_EMAIL error", async () => {
      const error = new Error(AUTH_ERRORS.INVALID_EMAIL);
      mockAuthService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(mockAuthService.login).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith({
        message: AUTH_ERRORS.INVALID_EMAIL,
        statusCode: HTTP_BAD_REQUEST,
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle INVALID_PASSWORD error", async () => {
      const error = new Error(AUTH_ERRORS.INVALID_PASSWORD);
      mockAuthService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(mockAuthService.login).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith({
        message: AUTH_ERRORS.INVALID_PASSWORD,
        statusCode: HTTP_BAD_REQUEST,
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle INVALID_CRIDENTIALS error", async () => {
      const error = new Error(AUTH_ERRORS.INVALID_CRIDENTIALS);
      mockAuthService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(mockAuthService.login).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith({
        message: AUTH_ERRORS.INVALID_CRIDENTIALS,
        statusCode: HTTP_UNAUTHORIZED,
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle unexpected errors with 500 status", async () => {
      const error = new Error("Unexpected error");
      mockAuthService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(mockAuthService.login).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith({
        message: "Unexpected error",
        statusCode: HTTP_INTERNAL_SERVER_ERROR,
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});