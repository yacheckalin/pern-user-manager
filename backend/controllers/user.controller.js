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
      res.status(500).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }
}

export default UserController;
