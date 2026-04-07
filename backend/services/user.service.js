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
    this.validateUserData(data, "create");

    const existingUsername = await this.userRepository.findUserByName(
      data.username,
    );
    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const existingEmail = await this.userRepository.findUserByEmail(data.email);
    if (existingEmail) {
      throw new Error("Email already exists");
    }

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

  async updateUser(id, data) {
    // validate data
    this.validateUserData(data, "update");
    // check if user exists
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new Error("User not found!");
    }
    // if email changed, check if this email doesn't exist in the DB
    if (data.email && user.email !== data.email) {
      const emailExists = await this.userRepository.findUserByEmail(data.email);
      if (emailExists && emailExists.id !== id) {
        throw new Error("This email has already taken!");
      }
    }
    const result = await this.userRepository.updateUser(id, data);
    return result;
  }

  validateUserData(data, flag = "create") {
    if (!data.username || data.username.length < 3) {
      throw new Error("Username must be at least 3 characters");
    }

    if (!data.email || !data.email.includes("@")) {
      throw new Error("Valid email is required");
    }

    if (flag === "create" && (!data.password || data.password.length < 6)) {
      throw new Error("Password must be at least 6 characters");
    }

    if (data.age && (data.age < 13 || data.age > 150)) {
      throw new Error("Age mest be between 13 and 150");
    }
  }
}

export default UserService;
