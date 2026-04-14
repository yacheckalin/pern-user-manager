import { AUTH_ERRORS } from "../../../constants/index.js";
import { USER_VALIDATION } from "../../../constants/user.constants.js";
import { jest } from "@jest/globals";

// Mock bcrypt module
jest.unstable_mockModule("bcrypt", () => ({
  default: {
    compare: jest.fn(),
  },
}));

// Mock database
jest.unstable_mockModule("../../../config/database.js", () => ({
  default: {},
}));

// Mock repositories
jest.unstable_mockModule("../../../repositories/auth.repo.js", () => ({
  default: jest.fn(),
}));

jest.unstable_mockModule("../../../repositories/user.repo.js", () => ({
  default: jest.fn(),
}));

// Mock user helpers
jest.unstable_mockModule("../../../utils/user.helpers.js", () => ({
  sanitizeUserData: jest.fn((data) => data),
}));

const bcryptModule = await import("bcrypt");
const { default: AuthService } = await import("../../../services/auth.service.js");
const { default: AuthRepository } = await import("../../../repositories/auth.repo.js");
const { default: UserRepository } = await import("../../../repositories/user.repo.js");

// Get the mocked bcrypt instance
const mockBcrypt = bcryptModule.default;

describe("AuthService - Unit Tests", () => {
  let authService;
  let mockUserRepository;

  const mockUser = {
    id: 1,
    username: "janeDoe",
    email: "jane@example.com",
    passwordHash: "$2b$10$hashedPasswordExample",
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

    // Mock repository constructors to return mock instances
    AuthRepository.mockImplementation(() => ({}));
    UserRepository.mockImplementation(() => mockUserRepository);

    // Create AuthService instance
    authService = new AuthService();
  });

  describe("Login User", () => {
    describe("Successful login", () => {
      it("should login user successfully with username", async () => {
        const loginData = {
          username: "janeDoe",
          password: "SecurePass123",
        };

        mockUserRepository.findUserByName.mockResolvedValue(mockUser);
        mockBcrypt.compare.mockResolvedValue(true);

        const result = await authService.login(loginData);

        expect(result).toEqual(mockUser);
        expect(mockUserRepository.findUserByName).toHaveBeenCalledWith("janeDoe");
        expect(mockBcrypt.compare).toHaveBeenCalledWith("SecurePass123", mockUser.passwordHash);
      });

      it("should login user successfully with email", async () => {
        const loginData = {
          username: "jane@example.com",
          password: "SecurePass123",
        };

        mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);
        mockBcrypt.compare.mockResolvedValue(true);

        const result = await authService.login(loginData);

        expect(result).toEqual(mockUser);
        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith("jane@example.com");
        expect(mockBcrypt.compare).toHaveBeenCalledWith("SecurePass123", mockUser.passwordHash);
      });
    });

    describe("Validation errors", () => {
      it("should throw INVALID_USERNAME_OR_EMAIL when username/email is empty", async () => {
        const loginData = {
          username: "",
          password: "SecurePass123",
        };

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL
        );
      });

      it("should throw INVALID_USERNAME when username is too short", async () => {
        const loginData = {
          username: "ab",
          password: "SecurePass123",
        };

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_USERNAME
        );
      });

      it("should throw INVALID_USERNAME when username exceeds max length", async () => {
        const loginData = {
          username: "a".repeat(USER_VALIDATION.USERNAME_MAX_LENGTH + 1),
          password: "SecurePass123",
        };

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_USERNAME
        );
      });

      it("should throw INVALID_EMAIL when email format is invalid", async () => {
        const loginData = {
          username: "invalidemail@",
          password: "SecurePass123",
        };

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_EMAIL
        );
      });

      it("should throw INVALID_PASSWORD when password is empty", async () => {
        const loginData = {
          username: "janeDoe",
          password: "",
        };

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_PASSWORD
        );
      });

      it("should throw INVALID_PASSWORD when password is too short", async () => {
        const loginData = {
          username: "janeDoe",
          password: "123",
        };

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_PASSWORD
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
          AUTH_ERRORS.INVALID_CRIDENTIALS
        );
      });

      it("should throw INVALID_CRIDENTIALS when user not found by email", async () => {
        const loginData = {
          username: "nonexistent@example.com",
          password: "SecurePass123",
        };

        mockUserRepository.findUserByEmail.mockResolvedValue(null);

        await expect(authService.login(loginData)).rejects.toThrow(
          AUTH_ERRORS.INVALID_CRIDENTIALS
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
          AUTH_ERRORS.INVALID_CRIDENTIALS
        );
      });
    });
  });
});