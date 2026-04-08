import { BCRYPT_ROUNDS, USER_ERRORS } from "../../constants";
import { jest } from "@jest/globals";
import bcrypt from "bcrypt";

// Mock the repository
jest.unstable_mockModule("../../repositories/user.repo.js", () => ({
  default: jest.fn().mockImplementation(() => ({
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    updateUserPassword: jest.fn(),
    deleteUser: jest.fn(),
    activateUser: jest.fn(),
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
    findUserByName: jest.fn(),
  })),
}));

const { default: UserService } = await import("../../services/user.service.js");
const { default: UserRepository } =
  await import("../../repositories/user.repo.js");

describe("UserService - Unit Tests", () => {
  let userService;
  let mockUserRepository;

  beforeEach(() => {
    // 1. Clear the constructor mock
    UserRepository.mockClear();

    // 2. Define what the constructor returns for this test
    // This creates the "instance" that UserService will use
    mockUserRepository = {
      getAllUsers: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      updateUserPassword: jest.fn(),
      deleteUser: jest.fn(),
      activateUser: jest.fn(),
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
      findUserByName: jest.fn(),
    };

    UserRepository.mockImplementation(() => mockUserRepository);

    // 3. When this runs 'new UserRepository()', it gets mockUserRepository
    userService = new UserService();
  });

  describe("createUser", () => {
    const validUserData = {
      username: "jane_doe",
      email: "jane@example.com",
      password: "SecurePass123",
      age: 25,
    };

    it("should create user successfully", async () => {
      // Arrange
      mockUserRepository.findUserById.mockResolvedValue(null);
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      mockUserRepository.findUserByName.mockResolvedValue(null);
      mockUserRepository.createUser.mockResolvedValue({
        id: 1,
        ...validUserData,
      });
      mockUserRepository.updateUser.mockResolvedValue({
        id: 1,
        ...validUserData,
      });

      // Act
      const result = await userService.createUser(validUserData);

      // Assert
      expect(result).toHaveProperty("id");
      expect(mockUserRepository.createUser).toHaveBeenCalled();
    });

    it("should throw error if email already exists", async () => {
      // Arrange
      mockUserRepository.findUserByEmail.mockResolvedValue({
        id: 2,
        email: validUserData.email,
      });

      // Act & Assert
      await expect(userService.createUser(validUserData)).rejects.toThrow(
        USER_ERRORS.EMAIL_TAKEN,
      );
    });

    it("should validate password length", async () => {
      // Arrange
      const invalidData = { ...validUserData, password: "short" };

      // Act & Assert
      await expect(userService.createUser(invalidData)).rejects.toThrow(
        USER_ERRORS.INVALID_PASSWORD,
      );
    });

    it("should throw error if username already exists", async () => {
      mockUserRepository.findUserByName.mockResolvedValue(
        validUserData.username,
      );

      await expect(userService.createUser(validUserData)).rejects.toThrow(
        USER_ERRORS.USERNAME_TAKEN,
      );
    });
  });

  describe("updateUser", () => {
    const validUserData = {
      username: "jane_doe",
      email: "jane@example.com",
      password: "SecurePass123",
      age: 25,
    };

    it("should update user successfully", async () => {
      // Arrange
      mockUserRepository.findUserById.mockResolvedValue({ id: 1 });
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      mockUserRepository.findUserByName.mockResolvedValue(null);
      mockUserRepository.updateUser.mockResolvedValue({
        id: 1,
        ...validUserData,
      });

      // Act
      const result = await userService.updateUser(1, validUserData);

      // Assert
      expect(result).toHaveProperty("id");
      expect(mockUserRepository.updateUser).toHaveBeenCalled();
    });

    it(`should return [${USER_ERRORS.NOT_FOUND}]`, async () => {
      mockUserRepository.findUserById.mockResolvedValue(null);

      await expect(userService.updateUser(1, validUserData)).rejects.toThrow(
        USER_ERRORS.NOT_FOUND,
      );
    });

    it(`should return [${USER_ERRORS.USERNAME_TAKEN}]`, async () => {
      mockUserRepository.findUserByName.mockResolvedValue({ id: 2 });
      mockUserRepository.findUserById.mockResolvedValue({ id: 1 });
      await expect(userService.updateUser(1, validUserData)).rejects.toThrow(
        USER_ERRORS.USERNAME_TAKEN,
      );
    });

    it(`should return [${USER_ERRORS.EMAIL_TAKEN}]`, async () => {
      mockUserRepository.findUserById.mockResolvedValue({ id: 1 });
      mockUserRepository.findUserByName.mockResolvedValue(null);
      mockUserRepository.findUserByEmail.mockResolvedValue({ id: 2 });

      await expect(userService.updateUser(1, validUserData)).rejects.toThrow(
        USER_ERRORS.EMAIL_TAKEN,
      );
    });
  });

  describe("Update Password", () => {
    const validUserData = {
      old_password: "some_secret_password",
      new_password: "new_secret_password",
      confirm_password: "new_secret_password",
    };

    const mockValidUser = {
      passwordHash:
        "$2b$10$YhoyGnzRZL8Ex0PTrFHd5elaqZgMe5UoolgHqzoTqDJFzU3r36eRK",
      email: "test@tt.tt",
      id: 1,
    };

    it("should update user password", async () => {
      mockUserRepository.findUserById.mockResolvedValue(mockValidUser);

      // Ensure the mock actually returns the user object
      mockUserRepository.updateUserPassword.mockResolvedValue(mockValidUser);

      // Act
      const result = await userService.updateUserPassword(1, {
        ...validUserData,
      });

      // Assert
      expect(result).toHaveProperty("id");
      expect(mockUserRepository.updateUserPassword).toHaveBeenCalled();
    });

    it(`should return [${USER_ERRORS.NOT_FOUND}]`, async () => {
      mockUserRepository.findUserById.mockResolvedValue(null);

      await expect(
        userService.updateUserPassword(1, validUserData),
      ).rejects.toThrow(USER_ERRORS.NOT_FOUND);
    });

    it(`should return [${USER_ERRORS.OLD_PASSWORD_INVALID}]`, async () => {
      mockUserRepository.findUserById.mockResolvedValue(mockValidUser);

      await expect(
        userService.updateUserPassword(1, {
          ...validUserData,
          old_password: "some_wrong_password",
        }),
      ).rejects.toThrow(USER_ERRORS.OLD_PASSWORD_INVALID);
    });

    it(`should return [${USER_ERRORS.NEW_PASSWORD_THE_SAME}]`, async () => {
      mockUserRepository.findUserById.mockResolvedValue(mockValidUser);

      await expect(
        userService.updateUserPassword(1, {
          ...validUserData,
          new_password: "some_secret_password",
          confirm_password: "some_secret_password",
        }),
      ).rejects.toThrow(USER_ERRORS.NEW_PASSWORD_THE_SAME);
    });

    it(`should return [${USER_ERRORS.INVALID_CONFIRM_PASSWORD}]`, async () => {
      mockUserRepository.findUserById.mockResolvedValue(mockValidUser);

      await expect(
        userService.updateUserPassword(1, {
          ...validUserData,
          new_password: "some_other_password",
        }),
      ).rejects.toThrow(USER_ERRORS.INVALID_CONFIRM_PASSWORD);
    });
  });
});
