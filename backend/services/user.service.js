const UserRepository = require("../repositories/user.repo");
const db = require("../config/database");

class UserService {
  constructor() {
    this.userRepository = new UserRepository(db);
  }

  async getAllUsers() {
    const result = this.userRepository.findAll();
    return result;
  }
}

module.exports = UserService;
