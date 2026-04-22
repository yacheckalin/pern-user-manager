import { jest } from "@jest/globals";
import {
  HTTP_BAD_REQUEST,
  HTTP_CONFLICT,
  HTTP_CREATED,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NO_CONTENT,
  HTTP_NOT_FOUND,
  HTTP_OK,
  SERVER_ERROR,
  USER_ERRORS,
  USER_MESSAGES,
  USER_VALIDATION,
} from "../../../constants/index.js";
import ApiError from "../../../errors/api.error.js";
import logger from "../../../logger.js";

jest.unstable_mockModule("../../../services/user.service.js", () => ({
  default: jest.fn().mockImplementation(() => ({
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getAllUsers: jest.fn(),
    updateUserPassword: jest.fn(),
    activateUser: jest.fn(),
    getUser: jest.fn(),
    registerUser: jest.fn(),
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
      getUser: jest.fn(),
      registerUser: jest.fn(),
    };

    UserService.mockImplementation(() => mockUserService);
    userController = new UserController();

    // Mock request and response
    req = {
      params: {},
      body: {},
      query: {},
      protocol: 'http',
      get: jest.fn().mockReturnValue('localhost'),
      originalUrl: '/api/users',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
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

      expect(res.status).toHaveBeenCalledWith(HTTP_OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUsers,
      });
    });

    it(`should return ${HTTP_INTERNAL_SERVER_ERROR}`, async () => {
      mockUserService.getAllUsers.mockRejectedValue(new ApiError({
        message: SERVER_ERROR.INTERNAL_SERVER_ERROR,
        status: HTTP_INTERNAL_SERVER_ERROR
      }))
      await userController.getAllUsers(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: SERVER_ERROR.INTERNAL_SERVER_ERROR, status: HTTP_INTERNAL_SERVER_ERROR }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    })
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
        is_active: false,
      };
      await userController.createUser(req, res, next);
      expect(res.set).toHaveBeenCalledWith('Location', expect.any(String));
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

    it("should call with error when service fails", async () => {
      const error = new ApiError({ message: "Database connection failed" });
      mockUserService.createUser.mockRejectedValue(error);

      req.body = {
        username: "username",
      };
      await userController.createUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: error.message,
          status: HTTP_INTERNAL_SERVER_ERROR
        }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it(`should return ${HTTP_CONFLICT} ; ${USER_ERRORS.EMAIL_TAKEN}`, async () => {
      mockUserService.createUser.mockRejectedValue(new ApiError({
        message: USER_ERRORS.EMAIL_TAKEN,
        status: HTTP_CONFLICT
      }));
      await userController.createUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: USER_ERRORS.EMAIL_TAKEN,
          status: HTTP_CONFLICT
        }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    })

    it(`should return ${HTTP_CONFLICT} : ${USER_ERRORS.USERNAME_TAKEN}`, async () => {
      mockUserService.createUser.mockRejectedValue(new ApiError({
        message: USER_ERRORS.USERNAME_TAKEN,
        status: HTTP_CONFLICT
      }));
      await userController.createUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: USER_ERRORS.USERNAME_TAKEN,
          status: HTTP_CONFLICT
        }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.INVALID_USERNAME}`, async () => {
      mockUserService.createUser.mockRejectedValue(new ApiError({
        message: USER_ERRORS.INVALID_USERNAME,
        status: HTTP_BAD_REQUEST
      }));
      await userController.createUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.INVALID_USERNAME, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.INVALID_AGE}`, async () => {
      mockUserService.createUser.mockRejectedValue(new ApiError({ message: USER_ERRORS.INVALID_AGE, status: HTTP_BAD_REQUEST }));
      await userController.createUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.INVALID_AGE, status: HTTP_BAD_REQUEST })
      )
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.INVALID_EMAIL}`, async () => {
      mockUserService.createUser.mockRejectedValue(new ApiError({ message: USER_ERRORS.INVALID_EMAIL, status: HTTP_BAD_REQUEST }));
      await userController.createUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.INVALID_EMAIL, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.INVALID_PASSWORD}`, async () => {
      mockUserService.createUser.mockRejectedValue(new ApiError({ message: USER_ERRORS.INVALID_PASSWORD, status: HTTP_BAD_REQUEST }));
      await userController.createUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.INVALID_PASSWORD, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    })
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
        new ApiError({
          message: USER_ERRORS.NOT_FOUND,
          status: HTTP_NOT_FOUND
        }
        ),
      );

      req.params.id = 999;
      await userController.updateUser(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.NOT_FOUND, status: HTTP_NOT_FOUND }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it(`should return ${HTTP_CONFLICT} : ${USER_ERRORS.USERNAME_TAKEN}`, async () => {
      mockUserService.updateUser.mockRejectedValue(new ApiError({
        message: USER_ERRORS.USERNAME_TAKEN, status: HTTP_CONFLICT
      }));
      await userController.updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.USERNAME_TAKEN, status: HTTP_CONFLICT }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.INVALID_USERNAME}`, async () => {
      mockUserService.updateUser.mockRejectedValue(new ApiError({
        message: USER_ERRORS.INVALID_USERNAME, status: HTTP_BAD_REQUEST
      }));
      await userController.updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.INVALID_USERNAME, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    })
    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.INVALID_EMAIL}`, async () => {
      mockUserService.updateUser.mockRejectedValue(new ApiError({
        message: USER_ERRORS.INVALID_EMAIL, status: HTTP_BAD_REQUEST
      }));
      await userController.updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.INVALID_EMAIL, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    })
    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.INVALID_AGE}`, async () => {
      mockUserService.updateUser.mockRejectedValue(new ApiError({
        message: USER_ERRORS.INVALID_AGE, status: HTTP_BAD_REQUEST
      }));
      await userController.updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.INVALID_AGE, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    })
  });
  describe("updateUserPassword", () => {
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
      mockUserService.updateUserPassword.mockResolvedValue({
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

      await userController.updateUserPassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(HTTP_OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: USER_MESSAGES.PASSWORD_CHANGED,
        data: mockUser,
      });
    });

    it("should return not found", async () => {
      mockUserService.updateUserPassword.mockRejectedValue(
        new ApiError({ message: USER_ERRORS.NOT_FOUND, status: HTTP_NOT_FOUND }),
      );

      req.params.id = 999;
      await userController.updateUserPassword(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.NOT_FOUND, status: HTTP_NOT_FOUND }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it(`should return ${HTTP_CONFLICT} : ${USER_ERRORS.INVALID_NEW_PASSWORD}`, async () => {
      mockUserService.updateUserPassword.mockRejectedValue(new ApiError(
        { message: USER_ERRORS.INVALID_NEW_PASSWORD, status: HTTP_BAD_REQUEST }));
      await userController.updateUserPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.INVALID_NEW_PASSWORD, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.INVALID_OLD_PASSWORD}`, async () => {
      mockUserService.updateUserPassword.mockRejectedValue(new ApiError(
        { message: USER_ERRORS.INVALID_OLD_PASSWORD, status: HTTP_BAD_REQUEST }));
      await userController.updateUserPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.INVALID_OLD_PASSWORD, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    })
    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.INVALID_CONFIRM_PASSWORD}`, async () => {
      mockUserService.updateUserPassword.mockRejectedValue(new ApiError({
        message: USER_ERRORS.INVALID_CONFIRM_PASSWORD, status: HTTP_BAD_REQUEST
      }));
      await userController.updateUserPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.INVALID_CONFIRM_PASSWORD, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    })
    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.OLD_PASSWORD_INVALID}`, async () => {
      mockUserService.updateUserPassword.mockRejectedValue(new ApiError({
        message: USER_ERRORS.OLD_PASSWORD_INVALID, status: HTTP_BAD_REQUEST
      }));
      await userController.updateUserPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.OLD_PASSWORD_INVALID, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    })
    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.NEW_PASSWORD_THE_SAME}`, async () => {
      mockUserService.updateUserPassword.mockRejectedValue(new ApiError({
        message: USER_ERRORS.NEW_PASSWORD_THE_SAME, status: HTTP_BAD_REQUEST
      }));
      await userController.updateUserPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.NEW_PASSWORD_THE_SAME, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    })
  });

  describe("deleteUser", () => {
    it("should return 404", async () => {
      mockUserService.deleteUser.mockRejectedValue(
        new ApiError({ message: USER_ERRORS.NOT_FOUND, status: HTTP_NOT_FOUND }),
      );
      req.params.id = 999;
      await userController.deleteUser(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.NOT_FOUND, status: HTTP_NOT_FOUND }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
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
      expect(res.status).toHaveBeenCalledWith(HTTP_NO_CONTENT);

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
        new ApiError({ message: USER_ERRORS.NOT_FOUND, status: HTTP_NOT_FOUND }),
      );
      req.params.id = 999;
      await userController.activateUser(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.NOT_FOUND, status: HTTP_NOT_FOUND }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it("should return 409", async () => {
      mockUserService.activateUser.mockRejectedValue(
        new ApiError({ message: USER_ERRORS.ALREADY_ACTIVATED, status: HTTP_CONFLICT }),
      );
      req.params.id = 999;
      await userController.activateUser(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.ALREADY_ACTIVATED, status: HTTP_CONFLICT }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  describe("getUser", () => {
    it("should get user by id", async () => {
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
      mockUserService.getUser.mockResolvedValue(mockedUser);

      await userController.getUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(HTTP_OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockedUser,
      });
    });
    it("should return 404", async () => {
      mockUserService.getUser.mockRejectedValue(
        new ApiError({ message: USER_ERRORS.NOT_FOUND, status: HTTP_NOT_FOUND }),
      );
      req.params.id = 999;
      await userController.getUser(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.NOT_FOUND, status: HTTP_NOT_FOUND }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("registerUser", () => {
    it("should return new registered user", async () => {
      mockUserService.registerUser.mockResolvedValue({
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
        is_active: false,
      };

      await userController.registerUser(req, res, next);

      expect(res.set).toHaveBeenCalledWith('Location', expect.any(String));
      expect(res.status).toHaveBeenCalledWith(HTTP_CREATED);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: USER_MESSAGES.REGISTERED,
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

    it("should call next with error when service fails", async () => {
      const error = new ApiError({ message: "Database connection failed" });
      mockUserService.registerUser.mockRejectedValue(error);

      req.body = {
        username: "username",
      };
      await userController.registerUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: error.message, status: HTTP_INTERNAL_SERVER_ERROR }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it(`should return ${HTTP_CONFLICT} : ${USER_ERRORS.EMAIL_TAKEN}`, async () => {
      mockUserService.registerUser.mockRejectedValue(
        new ApiError({ message: USER_ERRORS.EMAIL_TAKEN, status: HTTP_CONFLICT }),
      );
      req.params.id = 999;
      await userController.registerUser(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.EMAIL_TAKEN, status: HTTP_CONFLICT }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it(`should return ${HTTP_CONFLICT} : ${USER_ERRORS.USERNAME_TAKEN}`, async () => {
      mockUserService.registerUser.mockRejectedValue(
        new ApiError({ message: USER_ERRORS.USERNAME_TAKEN, status: HTTP_CONFLICT }),
      );
      req.params.id = 999;
      await userController.registerUser(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.USERNAME_TAKEN, status: HTTP_CONFLICT }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.INVALID_USERNAME}`, async () => {
      mockUserService.registerUser.mockRejectedValue(
        new ApiError({ message: USER_ERRORS.INVALID_USERNAME, status: HTTP_BAD_REQUEST }),
      );
      req.params.id = 999;
      await userController.registerUser(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.INVALID_USERNAME, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.INVALID_EMAIL}`, async () => {
      mockUserService.registerUser.mockRejectedValue(
        new ApiError({ message: USER_ERRORS.INVALID_EMAIL, status: HTTP_BAD_REQUEST }),
      );
      req.params.id = 999;
      await userController.registerUser(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.INVALID_EMAIL, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.INVALID_PASSWORD}`, async () => {
      mockUserService.registerUser.mockRejectedValue(
        new ApiError({ message: USER_ERRORS.INVALID_PASSWORD, status: HTTP_BAD_REQUEST }),
      );
      req.params.id = 999;
      await userController.registerUser(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.INVALID_PASSWORD, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.INVALID_AGE}`, async () => {
      mockUserService.registerUser.mockRejectedValue(
        new ApiError({
          message: USER_ERRORS.INVALID_AGE, status: HTTP_BAD_REQUEST
        }),
      );
      req.params.id = 999;
      await userController.registerUser(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.INVALID_AGE, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it(`should return ${HTTP_BAD_REQUEST} : ${USER_ERRORS.INVALID_CONFIRM_PASSWORD}`, async () => {
      mockUserService.registerUser.mockRejectedValue(
        new ApiError({ message: USER_ERRORS.INVALID_CONFIRM_PASSWORD, status: HTTP_BAD_REQUEST }),
      );
      req.params.id = 999;
      await userController.registerUser(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: USER_ERRORS.INVALID_CONFIRM_PASSWORD, status: HTTP_BAD_REQUEST }));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

  });

});
