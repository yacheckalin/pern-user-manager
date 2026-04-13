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

  async createUser(req, res, next) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(HTTP_CREATED).json({
        success: true,
        message: USER_MESSAGES.CREATED,
        data: user,
      });
    } catch (error) {
      // Handle conflict errors (duplicate username/email)
      if (
        error.message === USER_ERRORS.EMAIL_TAKEN ||
        error.message === USER_ERRORS.USERNAME_TAKEN
      ) {
        next({ message: error.message, statusCode: HTTP_CONFLICT });
      }

      // Handle validation errors
      if (
        error.message === USER_ERRORS.INVALID_USERNAME ||
        error.message === USER_ERRORS.INVALID_EMAIL ||
        error.message === USER_ERRORS.INVALID_PASSWORD ||
        error.message === USER_ERRORS.INVALID_AGE
      ) {
        next({ message: error.message, statusCode: HTTP_BAD_REQUEST });
      }

      // Handle other errors
      const statusCode =
        error.message === USER_ERRORS.NOT_FOUND
          ? HTTP_NOT_FOUND
          : HTTP_INTERNAL_SERVER_ERROR;

      next({ message: error.message, statusCode });
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;

      const user = await this.userService.updateUser(id, req.body);
      res.status(HTTP_OK).json({
        success: true,
        message: USER_MESSAGES.UPDATED,
        data: user,
      });
    } catch (error) {
      // Handle conflict errors (duplicate username/email)
      if (error.message === USER_ERRORS.USERNAME_TAKEN) {

        next({ message: error.message, statusCode: HTTP_CONFLICT });
      }

      // Handle validation errors
      if (
        error.message === USER_ERRORS.INVALID_USERNAME ||
        error.message === USER_ERRORS.INVALID_EMAIL ||
        error.message === USER_ERRORS.INVALID_AGE
      ) {

        next({ message: error.message, statusCode: HTTP_BAD_REQUEST });
      }

      // Handle other errors
      const statusCode =
        error.message === USER_ERRORS.NOT_FOUND
          ? HTTP_NOT_FOUND
          : HTTP_INTERNAL_SERVER_ERROR;

      next({ message: error.message, statusCode });
    }
  }

  async updateUserPassword(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.userService.updateUserPassword(id, req.body);
      res.status(HTTP_OK).json({
        success: true,
        message: USER_MESSAGES.PASSWORD_CHANGED,
        data: user,
      });
    } catch (error) {
      // Handle validation errors
      if (
        error.message === USER_ERRORS.INVALID_NEW_PASSWORD ||
        error.message === USER_ERRORS.INVALID_OLD_PASSWORD ||
        error.message === USER_ERRORS.INVALID_CONFIRM_PASSWORD ||
        error.message === USER_ERRORS.OLD_PASSWORD_INVALID ||
        error.message === USER_ERRORS.NEW_PASSWORD_THE_SAME
      ) {

        next({ message: error.message, statusCode: HTTP_BAD_REQUEST });
      }

      // Handle other errors
      const statusCode =
        error.message === USER_ERRORS.NOT_FOUND
          ? HTTP_NOT_FOUND
          : HTTP_INTERNAL_SERVER_ERROR;

      next({ message: error.message, statusCode });
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.userService.deleteUser(id);
      res.status(HTTP_OK).json({
        success: true,
        message: USER_MESSAGES.DELETED,
        data: user,
      });
    } catch (error) {
      const statusCode =
        error.message === USER_ERRORS.NOT_FOUND
          ? HTTP_NOT_FOUND
          : HTTP_INTERNAL_SERVER_ERROR;

      next({ message: error.message, statusCode });
    }
  }

  async activateUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.userService.activateUser(id);
      res.status(HTTP_OK).json({
        success: true,
        message: USER_MESSAGES.ACTIVATED,
        data: user,
      });
    } catch (error) {
      // Handle conflict error (already activated)
      if (error.message === USER_ERRORS.ALREADY_ACTIVATED) {

        next({ message: error.message, statusCode: HTTP_CONFLICT });
      }

      // Handle other errors
      const statusCode =
        error.message === USER_ERRORS.NOT_FOUND
          ? HTTP_NOT_FOUND
          : HTTP_INTERNAL_SERVER_ERROR;

      next({ message: error.message, statusCode });
    }
  }
}

export default UserController;
