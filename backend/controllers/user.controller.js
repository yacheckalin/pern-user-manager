import UserService from "../services/user.service.js";
import TokenService from "../services/token.service.js";
import {
  HTTP_OK,
  HTTP_CREATED,
  USER_MESSAGES,
  HTTP_NO_CONTENT,
} from "../constants/index.js";
import asyncHandler from "../middleware/async-handler.js";
import logger from "../logger.js";

class UserController {
  constructor() {
    this.userService = new UserService();
    this.tokenService = new TokenService();
  }

  getAllUsers = asyncHandler(async (req, res, next) => {
    const { s: search, ...query } = req.query;
    const { items, total, cursor, limit } = await this.userService.getAllUsers({ search, ...query });
    res.status(HTTP_OK).set("x-total-count", total).json({
      success: true,
      data: items,
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
        limit,
        cursor,
      }
    });
  });

  getUsersStatistics = asyncHandler(async (req, res, next) => {
    const result = await this.userService.getUsersStatistics();

    res.status(HTTP_OK).json({
      success: true,
      data: result
    })
  })

  getAllTokensByUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const results = await this.tokenService.getAllByUserId(id);
    res.status(HTTP_OK).set("x-total-count", results.length).json({
      success: true,
      data: results,
    });
  });

  getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await this.userService.getUser(id);

    res.status(HTTP_OK).json({ success: true, data: user });
  });

  createUser = asyncHandler(async (req, res, next) => {
    const user = await this.userService.createUser(req.body);
    const location =
      req.protocol + "://" + req.get("host") + req.originalUrl + "/" + user.id;
    res.status(HTTP_CREATED).set("Location", location).json({
      success: true,
      message: USER_MESSAGES.CREATED,
      data: user,
    });
  });

  updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await this.userService.updateUser(id, req.body);

    res.status(HTTP_OK).json({
      success: true,
      message: USER_MESSAGES.UPDATED,
      data: user,
    });
  });

  updateUserPassword = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await this.userService.updateUserPassword(id, req.body);

    res.status(HTTP_OK).json({
      success: true,
      message: USER_MESSAGES.PASSWORD_CHANGED,
      data: user,
    });
  });

  deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await this.userService.deleteUser(id);

    res.status(HTTP_NO_CONTENT).send();
  });

  activateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await this.userService.activateUser(id);

    res.status(HTTP_OK).json({
      success: true,
      message: USER_MESSAGES.ACTIVATED,
      data: user,
    });
  });

  registerUser = asyncHandler(async (req, res, next) => {
    const user = await this.userService.registerUser(req.body);
    const location =
      req.protocol + "://" + req.get("host") + req.originalUrl + "/" + user.id;
    res.status(HTTP_CREATED).set("Location", location).json({
      success: true,
      message: USER_MESSAGES.REGISTERED,
      data: user,
    });
  });

  logoutUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await this.tokenService.logoutUser(id);
    res.status(HTTP_NO_CONTENT).send();
  });
}

export default UserController;
