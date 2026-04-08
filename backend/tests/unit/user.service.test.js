import { USER_ERRORS } from "../../constants";
import { jest } from "@jest/globals";

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
});
