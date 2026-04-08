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
    deleteUserById: jest.fn(),
    activateUserById: jest.fn(),
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
    findUserByName: jest.fn(),
    findAll: jest.fn(),
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
      deleteUserById: jest.fn(),
      activateUserById: jest.fn(),
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
      findUserByName: jest.fn(),
      findAll: jest.fn(),
    };

    UserRepository.mockImplementation(() => mockUserRepository);

    // 3. When this runs 'new UserRepository()', it gets mockUserRepository
    userService = new UserService();
  });

  describe("Create User", () => {
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

  describe("Update User", () => {
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

  describe("Delete User", () => {
    it(`should delete user`, async () => {
      mockUserRepository.findUserById.mockResolvedValue({ id: 1 });
      mockUserRepository.deleteUserById.mockResolvedValue({ id: 1 });

      const result = await userService.deleteUser(1);

      expect(result).toHaveProperty("id");
      expect(mockUserRepository.deleteUserById).toHaveBeenCalled();
    });

    it(`should return [${USER_ERRORS.NOT_FOUND}]`, async () => {
      mockUserRepository.findUserById.mockResolvedValue(null);

      await expect(userService.deleteUser(1)).rejects.toThrow(
        USER_ERRORS.NOT_FOUND,
      );
    });
  });

  describe("Activate User", () => {
    it(`should activate user`, async () => {
      mockUserRepository.findUserById.mockResolvedValue({ id: 1 });
      mockUserRepository.activateUserById.mockResolvedValue({ id: 1 });

      const result = await userService.activateUser(1);

      expect(result).toHaveProperty("id");
      expect(mockUserRepository.activateUserById).toHaveBeenCalled();
    });

    it(`should return [${USER_ERRORS.NOT_FOUND}]`, async () => {
      mockUserRepository.findUserById.mockResolvedValue(null);

      await expect(userService.activateUser(1)).rejects.toThrow(
        USER_ERRORS.NOT_FOUND,
      );
    });

    it(`should return [${USER_ERRORS.ALREADY_ACTIVATED}]`, async () => {
      mockUserRepository.findUserById.mockResolvedValue({
        id: 1,
        isActive: true,
        activatedAt: new Date(),
      });

      await expect(userService.activateUser(1)).rejects.toThrow(
        USER_ERRORS.ALREADY_ACTIVATED,
      );
    });
  });
  describe("Get All Users", () => {
    it(`should return all users`, async () => {
      mockUserRepository.findAll.mockResolvedValue([{ id: 1 }]);

      const result = await userService.getAllUsers();
      expect(result[0]).toHaveProperty("id");
      expect(mockUserRepository.findAll).toHaveBeenCalled();
    });
  });

  describe("validateCreateUserData()", () => {
    const validData = {
      username: "username",
      email: "user_email@gmail.com",
      password: "some_secret_password",
      age: 20,
    };

    it(`validate create user data`, () => {
      expect(() => userService.validateCreateUserData(validData)).not.toThrow();
    });
    it(`should return [${USER_ERRORS.INVALID_USERNAME}]`, () => {
      expect(() =>
        userService.validateCreateUserData({ username: "u" }),
      ).toThrow(USER_ERRORS.INVALID_USERNAME);
    });

    it(`should return [${USER_ERRORS.INVALID_EMAIL}]`, () => {
      expect(() =>
        userService
          .validateCreateUserData({
            username: "username",
            email: "email",
          })
          .toThrow(USER_ERRORS.INVALID_EMAIL),
      );
    });

    it(`should return [${USER_ERRORS.INVALID_PASSWORD}]`, () => {
      expect(() =>
        userService.validateCreateUserData({
          username: "username",
          email: "some_email@email.com",
          password: "12345",
        }),
      ).toThrow(USER_ERRORS.INVALID_PASSWORD);
    });

    it(`should return [${USER_ERRORS.INVALID_AGE}]`, () => {
      expect(() =>
        userService.validateCreateUserData({ ...validData, age: 10 }),
      ).toThrow(USER_ERRORS.INVALID_AGE);
      expect(() =>
        userService.validateCreateUserData({ ...validData, age: 151 }),
      ).toThrow(USER_ERRORS.INVALID_AGE);
    });
  });

  describe("validateUpdateUserData", () => {
    const validData = {
      username: "valid_username",
      email: "valid_email@email.com",
      age: 20,
    };
    it(`should validate update user data`, () => {
      expect(() => userService.validateUpdateUserData(validData)).not.toThrow();
    });

    it(`should return [${USER_ERRORS.INVALID_USERNAME}]`, () => {
      expect(() =>
        userService.validateUpdateUserData({ username: "u" }),
      ).toThrow(USER_ERRORS.INVALID_USERNAME);
    });

    it(`should return [${USER_ERRORS.INVALID_EMAIL}]`, () => {
      expect(() =>
        userService.validateUpdateUserData({
          username: "username",
          email: "mmmm",
        }),
      ).toThrow(USER_ERRORS.INVALID_EMAIL);
    });

    it(`should return [${USER_ERRORS.INVALID_AGE}]`, () => {
      expect(() =>
        userService.validateUpdateUserData({
          username: "username",
          email: "some_email@mail.com",
          age: 10,
        }),
      ).toThrow(USER_ERRORS.INVALID_AGE);
      expect(() =>
        userService.validateUpdateUserData({
          username: "username",
          email: "some_email@mail.com",
          age: 151,
        }),
      ).toThrow(USER_ERRORS.INVALID_AGE);
    });
  });

  describe("validateUpdateUserPasswordData", () => {
    const validData = {
      old_password: "some_old_password",
      new_password: "some_new_password",
      confirm_password: "some_new_password",
    };

    it(`validate update user password data`, () => {
      expect(() =>
        userService.validateUpdateUserPasswordData(validData),
      ).not.toThrow();
    });

    it(`should return [${USER_ERRORS.INVALID_NEW_PASSWORD}]`, () => {
      expect(() =>
        userService.validateUpdateUserPasswordData({ new_password: "weak" }),
      ).toThrow(USER_ERRORS.INVALID_NEW_PASSWORD);
    });

    it(`should return [${USER_ERRORS.INVALID_OLD_PASSWORD}]`, () => {
      expect(() =>
        userService.validateUpdateUserPasswordData({
          old_password: "weak",
          new_password: "somw_strong_new_password",
        }),
      ).toThrow(USER_ERRORS.INVALID_OLD_PASSWORD);
    });

    it(`should return [${USER_ERRORS.INVALID_CONFIRM_PASSWORD}]`, () => {
      expect(() =>
        userService.validateUpdateUserPasswordData({
          new_password: "some_new_password",
          old_password: "some_old_password",
          confirm_password: "some_other_password",
        }),
      ).toThrow(USER_ERRORS.INVALID_CONFIRM_PASSWORD);
    });
  });
});
