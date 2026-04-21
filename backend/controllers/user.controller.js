import UserService from "../services/user.service.js";
import {
  HTTP_OK,
  HTTP_CREATED,
  USER_MESSAGES,
} from "../constants/index.js";
import asyncHandler from "../middleware/async-handler.js";

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = asyncHandler(async (req, res, next) => {
    const results = await this.userService.getAllUsers();
    res.status(HTTP_OK).json({
      success: true,
      data: results,
    });
  })

  getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await this.userService.getUser(id);

    res.status(HTTP_OK).json({ success: true, data: user })
  })

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
