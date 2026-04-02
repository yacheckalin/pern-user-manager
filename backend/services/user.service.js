import UserRepository from "../repositories/user.repo.js";
import db from "../config/database.js";

class UserService {
  constructor() {
    this.userRepository = new UserRepository(db);
  }

  async getAllUsers() {
    const result = this.userRepository.findAll();
    return result;
  }
}

export default UserService;
