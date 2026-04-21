import UserService from "../services/user.service.js";
import {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_CONFLICT,
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
  USER_ERRORS,
  USER_MESSAGES,
} from "../constants/index.js";
import asyncHandler from "../middleware/async-handler.js";

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req, res, next) {
    try {
      const results = await this.userService.getAllUsers();
      res.status(HTTP_OK).json({
        success: true,
        data: results,
      });
    } catch (error) {
      next({ message: error.message, statusCode: HTTP_INTERNAL_SERVER_ERROR });
    }
  }

  async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.userService.getUser(id);

      res.status(HTTP_OK).json({ success: true, data: user })
    } catch (error) {
      // Handle other errors
      const statusCode =
        error.message === USER_ERRORS.NOT_FOUND
          ? HTTP_NOT_FOUND
          : HTTP_INTERNAL_SERVER_ERROR;

      next({ message: error.message, statusCode })
    }
  }

  createUser = asyncHandler(async (req, res, next) => {
    const user = await this.userService.createUser(req.body);
    res.status(HTTP_CREATED).json({
      success: true,
      message: USER_MESSAGES.CREATED,
      data: user,
    });
  })

  updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await this.userService.updateUser(id, req.body);

    res.status(HTTP_OK).json({
      success: true,
      message: USER_MESSAGES.UPDATED,
      data: user,
    });
  })

  updateUserPassword = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await this.userService.updateUserPassword(id, req.body);

    res.status(HTTP_OK).json({
      success: true,
      message: USER_MESSAGES.PASSWORD_CHANGED,
      data: user,
    });
  })

  deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await this.userService.deleteUser(id);

    res.status(HTTP_OK).json({
      success: true,
      message: USER_MESSAGES.DELETED,
      data: user,
    });
  })

  activateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await this.userService.activateUser(id);

    res.status(HTTP_OK).json({
      success: true,
      message: USER_MESSAGES.ACTIVATED,
      data: user,
    });
  })

  registerUser = asyncHandler(async (req, res, next) => {
    const user = await this.userService.registerUser(req.body);

    res.status(HTTP_CREATED).json({
      success: true,
      message: USER_MESSAGES.REGISTERED,
      data: user,
    });
  })
}

export default UserController;
