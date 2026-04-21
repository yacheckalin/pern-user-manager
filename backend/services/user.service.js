import UserRepository from "../repositories/user.repo.js";
import db from "../config/database.js";
import bcrypt from "bcrypt";
import {
  BCRYPT_ROUNDS,
  HTTP_BAD_REQUEST,
  HTTP_CONFLICT,
  HTTP_NOT_FOUND,
  USER_CODES,
  USER_DEFAULTS,
  USER_ERRORS,
  USER_VALIDATION,
} from "../constants/index.js";

import { sanitizeUserData, sanitizeUpdateUserPassword } from "../utils/user.helpers.js";

import ApiError from "../errors/api.error.js";

class UserService {
  constructor() {
    this.userRepository = new UserRepository(db);
  }

  async getAllUsers() {
    const result = await this.userRepository.findAll();
    return result;
  }

  async getUser(id) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new Error(USER_ERRORS.NOT_FOUND)
    }
    return user;
  }

  async createUser(data) {
    this.validateCreateUserData(sanitizeUserData(data));

    const existingUsername = await this.userRepository.findUserByName(
      data.username,
    );
    if (existingUsername) {
      throw new ApiError({
        message: USER_ERRORS.USERNAME_TAKEN,
        code: USER_CODES.USERNAME_TAKEN,
        status: HTTP_CONFLICT
      });
    }

    const existingEmail = await this.userRepository.findUserByEmail(data.email);
    if (existingEmail) {
      throw new ApiError({
        message: USER_ERRORS.EMAIL_TAKEN,
        code: USER_CODES.EMAIL_TAKEN,
        status: HTTP_CONFLICT
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    const result = await this.userRepository.createUser({
      username: data.username,
      email: data.email,
      password_hash: passwordHash,
      age: data.age,
      is_active: data.is_active === 1 || data.is_active === "true",
    });

    return result;
  }

  async registerUser(data) {
    this.validateCreateUserData(sanitizeUserData(data));

    const existingUsername = await this.userRepository.findUserByName(
      data.username,
    );
    if (existingUsername) {
      throw new ApiError({
        message: USER_ERRORS.USERNAME_TAKEN,
        code: USER_CODES.USERNAME_TAKEN,
        status: HTTP_CONFLICT
      });
    }

    const existingEmail = await this.userRepository.findUserByEmail(data.email);
    if (existingEmail) {
      throw new ApiError({
        message: USER_ERRORS.EMAIL_TAKEN,
        code: USER_CODES.EMAIL_TAKEN,
        status: HTTP_CONFLICT
      });
    }

    // check if password and confirm_password the same
    if (String(data.password).toUpperCase() !== String(data.confirm_password).toUpperCase()) {
      throw new ApiError({
        message: USER_ERRORS.INVALID_CONFIRM_PASSWORD,
        code: USER_CODES.INVALID_CONFIRM_PASSWORD,
        status: HTTP_BAD_REQUEST
      })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    const result = await this.userRepository.createUser({
      username: data.username,
      email: data.email,
      password_hash: passwordHash,
      age: data.age,
      is_active: USER_DEFAULTS.IS_ACTIVE,
    });

    return result;
  }

  async updateUser(id, data) {
    // validate data
    this.validateUpdateUserData(sanitizeUserData(data));

    // check if user exists
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new ApiError({
        message: USER_ERRORS.NOT_FOUND,
        status: HTTP_NOT_FOUND,
        code: USER_CODES.USER_NOT_FOUND
      });
    }

    // check if userName is empty
    const userNameExists = await this.userRepository.findUserByName(
      data.username,
    );
    if (userNameExists && userNameExists.id !== id) {
      throw new ApiError({
        message: USER_ERRORS.USERNAME_TAKEN,
        code: USER_CODES.USERNAME_TAKEN,
        status: HTTP_CONFLICT
      });
    }

    // if email changed, check if this email doesn't exist in the DB
    if (data.email && user.email !== data.email) {
      const emailExists = await this.userRepository.findUserByEmail(data.email);
      if (emailExists && emailExists.id !== id) {
        throw new ApiError({
          message: USER_ERRORS.EMAIL_TAKEN,
          code: USER_CODES.EMAIL_TAKEN,
          status: HTTP_CONFLICT
        });
      }
    }
    const result = await this.userRepository.updateUser(id, data);
    return result;
  }

  async updateUserPassword(id, data) {
    this.validateUpdateUserPasswordData(sanitizeUpdateUserPassword(data));

    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new ApiError({
        message: USER_ERRORS.NOT_FOUND,
        status: HTTP_NOT_FOUND,
        code: USER_CODES.USER_NOT_FOUND
      });
    }

    // check old password
    const isValidPassword = await bcrypt.compare(
      data.old_password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new ApiError({
        message: USER_ERRORS.OLD_PASSWORD_INVALID,
        status: HTTP_BAD_REQUEST,
        code: USER_CODES.OLD_PASSWORD_INVALID
      });
    }

    // check new password
    const isSameNewPassword = await bcrypt.compare(
      data.new_password,
      user.passwordHash,
    );

    if (isSameNewPassword) {
      throw new ApiError({
        message: USER_ERRORS.NEW_PASSWORD_THE_SAME,
        code: USER_CODES.NEW_PASSWORD_THE_SAME,
        status: HTTP_BAD_REQUEST
      });
    }

    const newPasswordHash = await bcrypt.hash(data.new_password, BCRYPT_ROUNDS);

    const result = await this.userRepository.updateUserPassword(id, {
      password: newPasswordHash,
    });
    return result;
  }

  async deleteUser(id) {
    // check if user exists
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new ApiError({
        message: USER_ERRORS.NOT_FOUND,
        code: USER_CODES.USER_NOT_FOUND,
        status: HTTP_NOT_FOUND
      });
    }

    const result = await this.userRepository.deleteUserById(id);
    return result;
  }

  async activateUser(id) {
    // check if user exists
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new ApiError({
        message: USER_ERRORS.NOT_FOUND,
        code: USER_CODES.USER_NOT_FOUND,
        status: HTTP_NOT_FOUND
      });
    }

    // check if user has already activated
    if (user.activatedAt && user.isActive) {
      throw new ApiError({
        message: USER_ERRORS.ALREADY_ACTIVATED,
        code: USER_CODES.ALREADY_ACTIVATED,
        status: HTTP_CONFLICT
      });
    }
    const result = await this.userRepository.activateUserById(id);
    return result;
  }

  validateCreateUserData(data) {
    if (
      !data.username ||
      data.username.length < USER_VALIDATION.USERNAME_MIN_LENGTH
    ) {
      throw new ApiError({
        message: USER_ERRORS.INVALID_USERNAME,
        status: HTTP_BAD_REQUEST,
        code: USER_CODES.INVALID_USERNAME
      });
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new ApiError({
        message: USER_ERRORS.INVALID_EMAIL,
        status: HTTP_BAD_REQUEST,
        code: USER_CODES.INVALID_EMAIL
      });
    }
    if (
      !data.password ||
      data.password.length < USER_VALIDATION.PASSWORD_MIN_LENGTH
    ) {
      throw new ApiError({
        message: USER_ERRORS.INVALID_PASSWORD,
        status: HTTP_BAD_REQUEST,
        code: USER_CODES.INVALID_PASSWORD
      });
    }
    if (
      data.age &&
      (data.age < USER_VALIDATION.AGE_MIN || data.age > USER_VALIDATION.AGE_MAX)
    ) {
      throw new ApiError({
        message: USER_ERRORS.INVALID_AGE,
        status: HTTP_BAD_REQUEST,
        code: USER_CODES.INVALID_AGE
      });
    }
  }

  validateUpdateUserData(data) {
    if (data.username !== undefined) {
      if (
        !data.username ||
        data.username.length < USER_VALIDATION.USERNAME_MIN_LENGTH
      ) {
        throw new ApiError({
          message: USER_ERRORS.INVALID_USERNAME,
          code: USER_CODES.INVALID_USERNAME,
          status: HTTP_BAD_REQUEST
        });
      }
    }

    if (data.email !== undefined) {
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new ApiError({
          message: USER_ERRORS.INVALID_EMAIL,
          status: HTTP_BAD_REQUEST,
          code: USER_CODES.INVALID_EMAIL
        });
      }
    }

    if (
      data.age !== undefined &&
      (data.age < USER_VALIDATION.AGE_MIN || data.age > USER_VALIDATION.AGE_MAX)
    ) {
      throw new ApiError({
        message: USER_ERRORS.INVALID_AGE,
        code: USER_CODES.INVALID_AGE,
        status: HTTP_BAD_REQUEST
      });
    }
  }

  validateUpdateUserPasswordData(data) {
    if (
      !data.new_password ||
      data.new_password.length < USER_VALIDATION.PASSWORD_MIN_LENGTH
    ) {
      throw new ApiError({
        message: USER_ERRORS.INVALID_NEW_PASSWORD,
        status: HTTP_BAD_REQUEST,
        code: USER_CODES.INVALID_NEW_PASSWORD
      });
    }
    if (
      !data.old_password ||
      data.old_password.length < USER_VALIDATION.PASSWORD_MIN_LENGTH
    ) {
      throw new ApiError({
        message: USER_ERRORS.INVALID_OLD_PASSWORD,
        code: USER_CODES.INVALID_OLD_PASSWORD,
        status: HTTP_BAD_REQUEST
      });
    }

    if (data.confirm_password && data.confirm_password !== data.new_password) {
      throw new ApiError({
        message: USER_ERRORS.INVALID_CONFIRM_PASSWORD,
        code: USER_CODES.INVALID_CONFIRM_PASSWORD,
        status: HTTP_BAD_REQUEST
      });
    }
  }
}

export default UserService;
