import db from "../config/database.js";
import {
  AUTH_ERRORS,
  JWT_DEFAULTS,
  TOKEN_ERRORS,
  WRONG_IP,
} from "../constants/index.js";
import { USER_VALIDATION } from "../constants/user.constants.js";
import { sanitizeUserData } from "../utils/user.helpers.js";
import bcrypt from "bcrypt";
import AuthRepository from "../repositories/auth.repo.js";
import UserRepository from "../repositories/user.repo.js";
import RefershTokensService from "./token.service.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import RefreshTokenService from "./token.service.js";
class AuthService {
  constructor() {
    this.authRepository = new AuthRepository(db);
    this.userRepository = new UserRepository(db);
    this.refreshTokenService = new RefreshTokenService();
  }

  async login(data) {
    let sanitizedData = sanitizeUserData(data);
    let user = null;
    this.validateLoginUserData(sanitizedData);

    // if email provided
    if (this.hasEmail(sanitizedData.username)) {
      user = await this.userRepository.findUserByEmail(sanitizedData.username);
    }

    // if username provided
    if (this.hasUsername(sanitizedData.username)) {
      user = await this.userRepository.findUserByName(sanitizedData.username);
    }

    if (!user) {
      throw new Error(AUTH_ERRORS.INVALID_CRIDENTIALS);
    }

    // check password
    const isValidPassword = await bcrypt.compare(
      sanitizedData.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new Error(AUTH_ERRORS.INVALID_CRIDENTIALS);
    }

    // add refresh_token to DB
    const { accessToken, refreshToken, storedToken } =
      await this.refreshTokenService.createToken({
        ...user,
        ipAddress: data.ip,
        userAgent: data.userAgent,
      });

    // add info about last_login
    const result = await this.authRepository.updateLastLogin(user.id);

    return { accessToken, refreshToken, result, storedToken };
  }

  async logout(data) {
    const result = await this.refreshTokenService.revokeToken(data);
    if (!result) {
      throw new Error(TOKEN_ERRORS.TOKEN_NOT_FOUND);
    }
    return result;
  }

  hasEmail(data) {
    return data && typeof data === "string" && [...data].includes("@");
  }
  hasUsername(data) {
    return data && typeof data === "string" && ![...data].includes("@");
  }

  hasValidPassword(data) {
    return (
      data &&
      typeof data === "string" &&
      data.length >= USER_VALIDATION.PASSWORD_MIN_LENGTH &&
      data.length <= USER_VALIDATION.PASSWORD_MAX_LENGTH
    );
  }

  validateLoginUserData(data) {
    const { username, password } = data;
    // Either username or email must be provided
    if (!this.hasUsername(username) && !this.hasEmail(username)) {
      throw new Error(AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL);
    }

    // If username is provided, validate it
    if (
      this.hasUsername(username) &&
      (username.length < USER_VALIDATION.USERNAME_MIN_LENGTH ||
        username.length > USER_VALIDATION.USERNAME_MAX_LENGTH)
    ) {
      throw new Error(AUTH_ERRORS.INVALID_USERNAME);
    }

    // If email is provided, validate it
    if (
      this.hasEmail(username) &&
      !username.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/is)
    ) {
      throw new Error(AUTH_ERRORS.INVALID_EMAIL);
    }

    // Password is always required
    if (!this.hasValidPassword(password)) {
      throw new Error(AUTH_ERRORS.INVALID_PASSWORD);
    }

    // If IP provided
    if (this.ip !== undefined && !validator.isIP(this.ip)) {
      throw new Error(WRONG_IP);
    }
  }
}

export default AuthService;
