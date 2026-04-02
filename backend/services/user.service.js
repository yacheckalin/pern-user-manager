import UserRepository from "../repositories/user.repo.js";
import db from "../config/database.js";
import bcrypt from "bcrypt";

class UserService {
  constructor() {
    this.userRepository = new UserRepository(db);
  }

  async getAllUsers() {
    const result = this.userRepository.findAll();
    return result;
  }

  async createUser(data) {
    //TODO: validate input here

    //TODO: check if username | email exists

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    const result = this.userRepository.createUser({
      username: data.username,
      email: data.email,
      password_hash: passwordHash,
      age: data.age,
      is_active: data.is_active === 1 || data.is_active === "true",
    });

    return result;
  }
}

export default UserService;
