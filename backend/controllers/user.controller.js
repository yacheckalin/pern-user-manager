import UserService from "../services/user.service.js";

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req, res, next) {
    try {
      const results = await this.userService.getAllUsers();
      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json({
        success: true,
        message: "User created succesfully",
        data: user,
      });
    } catch (error) {
      const statusCode = error.message === "User not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;

      const user = await this.userService.updateUser(id, req.body);
      res.status(200).json({
        success: true,
        message: "User updated successfully!",
        data: user,
      });
    } catch (error) {
      const statusCode = error.message === "User not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }

  async updateUserPassword(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.userService.updateUserPassword(id, req.body);
      res.status(200).json({
        success: true,
        message: "User password was changed successfully!",
        data: user,
      });
    } catch (error) {
      const statusCode = error.message === "User not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }
}

export default UserController;
