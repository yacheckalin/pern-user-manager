import { jest } from "@jest/globals";
import {
  HTTP_CREATED,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_OK,
  USER_ERRORS,
  USER_MESSAGES,
} from "../../../constants";

jest.unstable_mockModule("../../../services/user.service.js", () => ({
  default: jest.fn().mockImplementation(() => ({
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getAllUsers: jest.fn(),
    updateUserPassword: jest.fn(),
    activateUser: jest.fn(),
  })),
}));
const { default: UserService } =
  await import("../../../services/user.service.js");
const { default: UserController } =
  await import("../../../controllers/user.controller.js");
describe("UserController - Unit Tests", () => {
  let userController;
  let mockUserService;
  let req, res, next;

  beforeEach(() => {
    mockUserService = {
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      getAllUsers: jest.fn(),
      updateUserPassword: jest.fn(),
      activateUser: jest.fn(),
    };

    UserService.mockImplementation(() => mockUserService);
    userController = new UserController();

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

  describe("getAllUsers", () => {
    it("should return all users when found", async () => {
      const mockUsers = [
        {
          id: "3",
          username: "test1",
          email: "test1@tt.tt",
          age: 18,
          isActive: false,
          createdAt: "2026-04-08T07:08:00.823Z",
          updatedAt: "2026-04-08T07:08:00.823Z",
          activatedAt: null,
          lastLogin: null,
        },
        {
          id: "4",
          username: "newUsername2",
          email: "test2@test.tt",
          age: 18,
          isActive: false,
          createdAt: "2026-04-08T07:10:00.105Z",
          updatedAt: "2026-04-08T07:12:59.381Z",
          activatedAt: null,
          lastLogin: null,
        },
        {
          id: "2",
          username: "test",
          email: "test@tt.tt",
          age: 18,
          isActive: true,
          createdAt: "2026-04-08T07:04:35.211Z",
          updatedAt: "2026-04-08T07:52:28.835Z",
          activatedAt: "2026-04-08T07:52:28.835Z",
          lastLogin: null,
        },
      ];
      mockUserService.getAllUsers.mockResolvedValue(mockUsers);

      await userController.getAllUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUsers,
      });
    });
  });

  describe("createUser", () => {
    it("should return new created user", async () => {
      mockUserService.createUser.mockResolvedValue({
        id: "1",
        username: "test1",
        email: "test1@tt.tt",
        age: 18,
        isActive: false,
        createdAt: "2026-04-08T07:08:00.823Z",
        updatedAt: "2026-04-08T07:08:00.823Z",
        activatedAt: null,
        lastLogin: null,
      });

      req.body = {
        username: "test1",
        email: "test1@tt.tt",
        age: 18,
        is_ctive: false,
      };
      await userController.createUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(HTTP_CREATED);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: USER_MESSAGES.CREATED,
        data: {
          id: "1",
          username: "test1",
          email: "test1@tt.tt",
          age: 18,
          isActive: false,
          createdAt: "2026-04-08T07:08:00.823Z",
          updatedAt: "2026-04-08T07:08:00.823Z",
          activatedAt: null,
          lastLogin: null,
        },
      });
    });

    it("should return 500 when something went wrong", async () => {
      mockUserService.createUser.mockRejectedValue(
        new Error("Internal Server Error"),
      );

      req.body = {
        username: "username",
      };
      await userController.createUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(HTTP_INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal Server Error",
      });
    });
  });

  describe("updateUser", () => {
    it("should return updated user", async () => {
      const mockUser = {
        id: "1",
        username: "test1",
        email: "test1@tt.tt",
        age: 18,
        isActive: false,
        createdAt: "2026-04-08T07:08:00.823Z",
        updatedAt: "2026-04-08T07:08:00.823Z",
        activatedAt: null,
        lastLogin: null,
      };
      mockUserService.updateUser.mockResolvedValue({
        id: "1",
        username: "test1",
        email: "test1@tt.tt",
        age: 18,
        isActive: false,
        createdAt: "2026-04-08T07:08:00.823Z",
        updatedAt: "2026-04-08T07:08:00.823Z",
        activatedAt: null,
        lastLogin: null,
      });

      await userController.updateUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(HTTP_OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: USER_MESSAGES.UPDATED,
        data: mockUser,
      });
    });

    it("should return not found", async () => {
      mockUserService.updateUser.mockRejectedValue(
        new Error(USER_ERRORS.NOT_FOUND),
      );

      req.params.id = 999;
      await userController.updateUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(HTTP_NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: USER_ERRORS.NOT_FOUND,
      });
    });
  });

  describe("deleteUser", () => {
    it("should return 404", async () => {
      mockUserService.deleteUser.mockRejectedValue(
        new Error(USER_ERRORS.NOT_FOUND),
      );
      req.params.id = 999;
      await userController.deleteUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(HTTP_NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: USER_ERRORS.NOT_FOUND,
      });
    });
    it("should delete user", async () => {
      const returnedUser = {
        id: "1",
        username: "test1",
        email: "test1@tt.tt",
        age: 18,
        isActive: false,
        createdAt: "2026-04-08T07:08:00.823Z",
        updatedAt: "2026-04-08T07:08:00.823Z",
        activatedAt: null,
        lastLogin: null,
      };
      mockUserService.deleteUser.mockResolvedValue(returnedUser);

      req.params.id = 1;
      await userController.deleteUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(HTTP_OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: USER_MESSAGES.DELETED,
        data: {
          id: "1",
          username: "test1",
          email: "test1@tt.tt",
          age: 18,
          isActive: false,
          createdAt: "2026-04-08T07:08:00.823Z",
          updatedAt: "2026-04-08T07:08:00.823Z",
          activatedAt: null,
          lastLogin: null,
        },
      });
    });
  });

  describe("activateUser", () => {
    it("should activate user", async () => {
      const mockedUser = {
        id: "1",
        username: "test1",
        email: "test1@tt.tt",
        age: 18,
        isActive: false,
        createdAt: "2026-04-08T07:08:00.823Z",
        updatedAt: "2026-04-08T07:08:00.823Z",
        activatedAt: null,
        lastLogin: null,
      };
      mockUserService.activateUser.mockResolvedValue(mockedUser);

      await userController.activateUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(HTTP_OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: USER_MESSAGES.ACTIVATED,
        data: mockedUser,
      });
    });
    it("should return 404", async () => {
      mockUserService.activateUser.mockRejectedValue(
        new Error(USER_ERRORS.NOT_FOUND),
      );
      req.params.id = 999;
      await userController.activateUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(HTTP_NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: USER_ERRORS.NOT_FOUND,
      });
    });
  });
});
