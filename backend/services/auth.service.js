import db from '../config/database.js';
import { AUTH_ERRORS, JWT_DEFAULTS } from '../constants/index.js';
import { USER_VALIDATION } from '../constants/user.constants.js';
import { sanitizeUserData } from '../utils/user.helpers.js';
import bcrypt from 'bcrypt';
import AuthRepository from '../repositories/auth.repo.js';
import UserRepository from '../repositories/user.repo.js';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
class AuthService {
  constructor() {
    this.authRepository = new AuthRepository(db);
    this.userRepository = new UserRepository(db);
  }

  async login(data) {
    let sanitizedData = sanitizeUserData(data);
    let user = null;
    this.validateLoginUserData(sanitizedData);

    // if email provided
    if (this.hasEmail(sanitizedData.username)) {
      user = await this.userRepository.findUserByEmail(sanitizedData.username)
    }

    // if username provided
    if (this.hasUsername(sanitizedData.username)) {
      user = await this.userRepository.findUserByName(sanitizedData.username);
    }

    if (!user) {
      throw new Error(AUTH_ERRORS.INVALID_CRIDENTIALS)
    }

    // check password
    const isValidPassword = await bcrypt.compare(sanitizedData.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error(AUTH_ERRORS.INVALID_CRIDENTIALS)
    }

    // add info about last_login
    const result = await this.authRepository.updateLastLogin(user.id);

    const accessToken = this.generateAccessToken(result);
    const refreshToken = this.generateRefreshToken(result);

    return { accessToken, refreshToken, user };
  }

  generateRefreshToken(user) {
    return jwt.sign({
      auth: {
        id: user.id,
        username: user.username,
        email: user.email,
        age: user.age,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        activatedAt: user.activatedAt,
        lastLogin: user.lastLogin,
      },
    },
      process.env.JWT_REFRESH_TOKEN_SECRET || JWT_DEFAULTS.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || JWT_DEFAULTS.REFRESH_TOKEN_EXPIRES_IN },
    )
  }

  generateAccessToken(user) {
    return jwt.sign(
      {
        auth: {
          id: user.id,
          username: user.username,
          email: user.email,
          age: user.age,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          activatedAt: user.activatedAt,
          lastLogin: user.lastLogin,
        },
      },
      process.env.JWT_ACCESS_TOKEN_SECRET || JWT_DEFAULTS.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || JWT_DEFAULTS.ACCESS_TOKEN_EXPIRES_IN },
    )
  }

  hasEmail(data) {
    return data && typeof data === 'string' && [...data].includes('@');
  }
  hasUsername(data) {
    return data && typeof data === 'string' && ![...data].includes('@');
  }

  hasValidPassword(data) {
    return data && typeof data === 'string' &&
      data.length >= USER_VALIDATION.PASSWORD_MIN_LENGTH &&
      data.length <= USER_VALIDATION.PASSWORD_MAX_LENGTH;
  }

  validateLoginUserData(data) {

    const { username, password } = data;
    // Either username or email must be provided
    if (!this.hasUsername(username) && !this.hasEmail(username)) {
      throw new Error(AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL)
    }

    // If username is provided, validate it
    if (this.hasUsername(username) && (
      username.length < USER_VALIDATION.USERNAME_MIN_LENGTH
      || username.length > USER_VALIDATION.USERNAME_MAX_LENGTH
    )) {
      throw new Error(AUTH_ERRORS.INVALID_USERNAME)
    }

    // If email is provided, validate it
    if (this.hasEmail(username) && !username.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/is)) {
      throw new Error(AUTH_ERRORS.INVALID_EMAIL)
    }

    // Password is always required
    if (!this.hasValidPassword(password)) {
      throw new Error(AUTH_ERRORS.INVALID_PASSWORD)
    }
  }
}

export default AuthService;