import {
  AUTH_ERRORS,
  JWT_DEFAULTS,
  WRONG_IP,
} from "../../../constants/index.js";
import {
  USER_MESSAGES,
  USER_VALIDATION,
  TOKEN_ERRORS,
} from "../../../constants/index.js";
import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import "dotenv/config";

// Mock bcrypt module
jest.unstable_mockModule("bcrypt", () => ({
  default: {
    compare: jest.fn(),
  },
}));

// Mock database
jest.unstable_mockModule("../../../config/database.js", () => ({
  default: {},
  query: jest.fn(),
  pool: jest.fn(),
}));

// Mock repositories
jest.unstable_mockModule("../../../repositories/auth.repo.js", () => ({
  default: jest.fn(),
}));

jest.unstable_mockModule("../../../repositories/user.repo.js", () => ({
  default: jest.fn(),
}));

jest.unstable_mockModule("../../../services/token.service.js", () => ({
  default: jest.fn(),
}));

// Mock user helpers
jest.unstable_mockModule("../../../utils/user.helpers.js", () => ({
  sanitizeUserData: jest.fn((data) => data),
}));

const bcryptModule = await import("bcrypt");
const { default: AuthService } =
  await import("../../../services/auth.service.js");
const { default: AuthRepository } =
  await import("../../../repositories/auth.repo.js");
const { default: UserRepository } =
  await import("../../../repositories/user.repo.js");
const { default: TokenService } =
  await import("../../../services/token.service.js");

// Get the mocked bcrypt instance
const mockBcrypt = bcryptModule.default;

describe("AuthService - Unit Tests", () => {
  let authService;
  let mockUserRepository;
  let mockAuthRepository;
  let tokenService;
  let mockRefreshTokenService;

  const mockUser = {
    id: 1,
    username: "janeDoe",
    email: "jane@example.com",
    passwordHash: "$2b$10$hashedPasswordExample",
    lastLogin: new Date("2024-01-01T00:00:00.000Z"),
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    AuthRepository.mockClear();
    UserRepository.mockClear();

    // Setup mock repositories
    mockUserRepository = {
      findUserByName: jest.fn(),
      findUserByEmail: jest.fn(),
    };
    mockAuthRepository = {
      updateLastLogin: jest.fn(),
    };

    const secret =
      process.env.JWT_ACCESS_TOKEN_SECRET || JWT_DEFAULTS.ACCESS_TOKEN_SECRET;

    const realToken = jwt.sign(
      {
        auth: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
        },
      },
      secret,
    );

    mockRefreshTokenService = {
      createToken: jest.fn().mockResolvedValue({
        accessToken: realToken,
        refreshToken: "mock-refresh-token",
        storedToken: { id: 1 },
      }),
      revokeToken: jest.fn(),
    };

    // Mock repository constructors to return mock instances
    AuthRepository.mockImplementation(() => mockAuthRepository);
    UserRepository.mockImplementation(() => mockUserRepository);
    TokenService.mockImplementation(() => mockRefreshTokenService);

    // Create AuthService instance
    authService = new AuthService();
    tokenService = new TokenService();
  });
  describe("Logout User", () => {
    it("should logout user successfully", async () => {
      tokenService.revokeToken.mockResolvedValue(true);
      const result = await authService.logout({
        userId: 1,
        tokenHash: "token-hash",
      });

      expect(result).toBeDefined();
    });
    it(`should throw ${TOKEN_ERRORS.TOKEN_NOT_FOUND}`, async () => {
      tokenService.revokeToken.mockRejectedValue(
        new Error(TOKEN_ERRORS.TOKEN_NOT_FOUND),
      );
      await expect(
        authService.logout({
          userId: 1,
          tokenHash: "token-hash",
        }),
      ).rejects.toThrow(TOKEN_ERRORS.TOKEN_NOT_FOUND);
    });
  });
  describe("Login User", () => {
    describe("Successful login", () => {
      it("should login user successfully with username", async () => {
        const loginData = {
          username: "janeDoe",
          password: "SecurePass123",
        };

        mockUserRepository.findUserByName.mockResolvedValue(mockUser);
        mockAuthRepository.updateLastLogin.mockResolvedValue({
          ...mockUser,
          lastLogin: new Date(),
        });
        mockBcrypt.compare.mockResolvedValue(true);

        const result = await authService.login(loginData);

        expect(result).toBeDefined();

        const decoded = jwt.verify(
          result.accessToken,
          process.env.JWT_ACCESS_TOKEN_SECRET ||
            JWT_DEFAULTS.ACCESS_TOKEN_SECRET,
        );

        expect(decoded.auth.id).toBeDefined();
        expect(decoded.auth.username).toBe(mockUser.username);
        expect(decoded.auth.email).toBe(mockUser.email);
        expect(mockUserRepository.findUserByName).toHaveBeenCalledWith(
          "janeDoe",
        );
        expect(mockAuthRepository.updateLastLogin).toHaveBeenCalled();
        expect(mockBcrypt.compare).toHaveBeenCalledWith(
          "SecurePass123",
          mockUser.passwordHash,
        );
      });

      it("should login user successfully with email", async () => {
        const loginData = {
          username: "jane@example.com",
          password: "SecurePass123",
        };
        const expectedTokens = {
          accessToken: "valid-looking-fake-access-token",
          refreshToken: "valid-looking-fake-refresh-token",
          storedToken: { id: 1 },
        };

        mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);
        mockAuthRepository.updateLastLogin.mockResolvedValue(mockUser);
        mockRefreshTokenService.createToken.mockResolvedValue(expectedTokens);
        mockBcrypt.compare.mockResolvedValue(true);

        const result = await authService.login(loginData);

        expect(result).toBeDefined();
        expect(result.accessToken).toBe(expectedTokens.accessToken);
        expect(result.refreshToken).toBe(expectedTokens.refreshToken);

        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
          "jane@example.com",
        );
        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
          "jane@example.com",
        );
        expect(mockBcrypt.compare).toHaveBeenCalledWith(
          "SecurePass123",
          mockUser.passwordHash,
        );
      });
    });

    describe("Validation errors", () => {
      it("should throw INVALID_USERNAME_OR_EMAIL when username/email is empty", async () => {
        const loginData = {
          username: "",
          password: "SecurePass123",
        };

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL,
        );
      });

      it("should throw INVALID_USERNAME when username is too short", async () => {
        const loginData = {
          username: "ab",
          password: "SecurePass123",
        };

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_USERNAME,
        );
      });

      it("should throw INVALID_USERNAME when username exceeds max length", async () => {
        const loginData = {
          username: "a".repeat(USER_VALIDATION.USERNAME_MAX_LENGTH + 1),
          password: "SecurePass123",
        };

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_USERNAME,
        );
      });

      it("should throw INVALID_EMAIL when email format is invalid", async () => {
        const loginData = {
          username: "invalidemail@",
          password: "SecurePass123",
        };

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_EMAIL,
        );
      });

      it("should throw INVALID_PASSWORD when password is empty", async () => {
        const loginData = {
          username: "janeDoe",
          password: "",
        };

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_PASSWORD,
        );
      });

      it("should throw INVALID_PASSWORD when password is too short", async () => {
        const loginData = {
          username: "janeDoe",
          password: "123",
        };

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_PASSWORD,
        );
      });
    });

    describe("Authentication errors", () => {
      it("should throw INVALID_CRIDENTIALS when user not found by username", async () => {
        const loginData = {
          username: "nonexistent",
          password: "SecurePass123",
        };

        mockUserRepository.findUserByName.mockResolvedValue(null);
        mockUserRepository.findUserByEmail.mockResolvedValue(null);

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_CRIDENTIALS,
        );
      });

      it("should throw INVALID_CRIDENTIALS when user not found by email", async () => {
        const loginData = {
          username: "nonexistent@example.com",
          password: "SecurePass123",
        };

        mockUserRepository.findUserByEmail.mockResolvedValue(null);

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_CRIDENTIALS,
        );
      });

      it("should throw INVALID_CRIDENTIALS when password is incorrect", async () => {
        const loginData = {
          username: "janeDoe",
          password: "WrongPassword123",
        };

        mockUserRepository.findUserByName.mockResolvedValue(mockUser);
        mockBcrypt.compare.mockResolvedValue(false);

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_CRIDENTIALS,
        );
      });
    });
  });
});
