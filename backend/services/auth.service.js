import db from "../config/database.js";
import {
  AUTH_ERRORS,
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_UNAUTHORIZED,
  JWT_DEFAULTS,
  TOKEN_ERRORS,
  USER_CODES,
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
import ApiError from "../errors/api.error.js";
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
      throw new ApiError({
        message: AUTH_ERRORS.INVALID_CRIDENTIALS,
        code: USER_CODES.INVALID_CRIDENTIALS,
        status: HTTP_UNAUTHORIZED
      });
    }

    // check password
    const isValidPassword = await bcrypt.compare(
      sanitizedData.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new ApiError({
        message: AUTH_ERRORS.INVALID_CRIDENTIALS,
        code: USER_CODES.INVALID_CRIDENTIALS,
        status: HTTP_UNAUTHORIZED
      }
      );
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
      throw new ApiError({
        message: AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL,
        code: USER_CODES.INVALID_USERNAME_OR_EMAIL,
        status: HTTP_BAD_REQUEST
      });
    }

    // If username is provided, validate it
    if (
      this.hasUsername(username) &&
      (username.length < USER_VALIDATION.USERNAME_MIN_LENGTH ||
        username.length > USER_VALIDATION.USERNAME_MAX_LENGTH)
    ) {
      throw new ApiError({
        message: AUTH_ERRORS.INVALID_USERNAME,
        code: USER_CODES.INVALID_USERNAME,
        status: HTTP_BAD_REQUEST
      });
    }

    // If email is provided, validate it
    if (
      this.hasEmail(username) &&
      !username.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/is)
    ) {
      throw new ApiError({
        message: AUTH_ERRORS.INVALID_EMAIL,
        code: USER_CODES.INVALID_EMAIL,
        status: HTTP_BAD_REQUEST
      });
    }

    // Password is always required
    if (!this.hasValidPassword(password)) {
      throw new ApiError({
        message: AUTH_ERRORS.INVALID_PASSWORD,
        code: USER_CODES.INVALID_PASSWORD,
        status: HTTP_BAD_REQUEST
      });
    }

    // If IP provided
    if (this.ip !== undefined && !validator.isIP(this.ip)) {
      throw new ApiError({
        message: WRONG_IP,
        code: USER_CODES.WRONG_IP,
        status: HTTP_INTERNAL_SERVER_ERROR
      });
    }
  }
}

export default AuthService;
