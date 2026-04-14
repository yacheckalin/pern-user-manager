import { AUTH_ERRORS, USER_ERRORS } from "../../../constants/index.js";
import { jest } from "@jest/globals";

// Mock the repository
jest.unstable_mockModule("../../../repositories/auth.repo.js", () => ({
  default: jest.fn().mockImplementation(() => ({
    login: jest.fn()
  })),
}));

// Mock the user helpers
jest.unstable_mockModule("../../../utils/user.helpers.js", () => ({
  sanitizeUserData: jest.fn((data) => data), // Return input unchanged
}));

const { default: AuthService } =
  await import("../../../services/auth.service.js");
const { default: AuthRepository } =
  await import("../../../repositories/auth.repo.js");

describe("AuthService - Unit Tests", () => {
  let authService;
  let mockAuthRepository;

  beforeEach(() => {
    // 1. Clear the constructor mock
    AuthRepository.mockClear();

    // 2. Define what the constructor returns for this test
    // This creates the "instance" that AuthService will use
    mockAuthRepository = {
      login: jest.fn()
    };

    AuthRepository.mockImplementation(() => mockAuthRepository);

    // 3. When this runs 'new AuthRepository()', it gets mockAuthRepository
    authService = new AuthService(AuthRepository);
  });

  describe("Login User", () => {
    const validUserData = {
      username: "janeDoe",
      password: "SecurePass123"
    };

    it('should login user successfully', async () => {
      mockAuthRepository.login.mockResolvedValue({ id: 1, ...validUserData });
      const res = await authService.login(validUserData);

      expect(res).toHaveProperty("id");
      expect(mockAuthRepository.login).toHaveBeenCalled()
    });

    it('should throw error if username or password are incorrect', async () => {
      mockAuthRepository.login.mockResolvedValue(null);

      await expect(authService.login(validUserData)).rejects.toThrow(AUTH_ERRORS.INVALID_CRIDENTIALS);
    });


    it(`should return [${AUTH_ERRORS.INVALID_USERNAME}]`, async () => {
      mockAuthRepository.login.mockResolvedValue({ id: 2 });

      await expect(authService.login({ ...validUserData, username: 'ss' }))
        .rejects.toThrow(AUTH_ERRORS.INVALID_USERNAME);
    });

    it(`should return [${AUTH_ERRORS.INVALID_EMAIL}]`, async () => {

      await expect(authService.login({ ...validUserData, username: 'invalidemail@' }))
        .rejects.toThrow(AUTH_ERRORS.INVALID_EMAIL);
    });

    it(`should return [${AUTH_ERRORS.INVALID_PASSWORD}]`, async () => {
      mockAuthRepository.login.mockResolvedValue({ id: 2 });

      await expect(authService.login({ ...validUserData, username: 'ema@dd.tt', password: '' }))
        .rejects.toThrow(AUTH_ERRORS.INVALID_PASSWORD);
    })
    it(`should return [${AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL}]`, async () => {
      mockAuthRepository.login.mockResolvedValue({ id: 2 });

      await expect(authService.login({ ...validUserData, username: '' }))
        .rejects.toThrow(AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL);
    })
  })
})