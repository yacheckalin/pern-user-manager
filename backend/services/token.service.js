import db from "../config/database.js";
import RefreshTokenRepository from "../repositories/token.repo.js";
import {
  JWT_DEFAULTS,
  ONE_WEEK,
  TOKEN_ERRORS,
  USER_ERRORS,
} from "../constants/index.js";
import dotenv from "dotenv";
import crypto from "crypto";
import ms from "ms";
import jwt from "jsonwebtoken";
import { sanitizeUserData } from "../utils/user.helpers.js";
import UserRepository from "../repositories/user.repo.js";

class RefreshTokenService {
  constructor() {
    this.refreshTokenRepository = new RefreshTokenRepository(db);
    this.userRepository = new UserRepository(db);
  }

  async createToken(data) {
    // The data has already been validated in AuthService
    const accessToken = this.generateAccessToken(data);
    const refreshToken = this.generateRefreshToken(data);

    // add to DB new data for existing user
    const storedToken = await this.refreshTokenRepository.createToken({
      ...data,
      tokenHash: this.generateTokenHash(refreshToken),
      expiresAt: new Date(
        Date.now() + ms(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || ONE_WEEK),
      ),
    });
    return { accessToken, refreshToken, storedToken };
  }

  async revokeToken(data) {
    const result = await this.refreshTokenRepository.revokeToken(data);
    return result;
  }

  async validateWithRotate(data) {
    // we should validate data here
    const sanitizedData = sanitizeUserData(data);
    const refreshToken = await this.refreshTokenRepository.findTokenByHash(
      sanitizedData.refreshToken,
    );

    if (!refreshToken) {
      throw new Error(TOKEN_ERRORS.TOKEN_NOT_FOUND);
    }

    if (refreshToken.revokedAt) {
      throw new Error(TOKEN_ERRORS.TOKEN_REVOKED);
    }

    if (new Date() > refreshToken.expiresAt) {
      throw new Error(TOKEN_ERRORS.TOKEN_EXPIRED);
    }

    // get user info
    const user = await this.userRepository.findUserById(refreshToken.userId);
    if (!user) {
      throw new Error(USER_ERRORS.NOT_FOUND);
    }
    // create new token and revoke old one
    const newToken = await this.createToken({ ...data, ...user });

    const rotatedToken =
      await this.refreshTokenRepository.revokeAndReplaceToken({
        newTokenId: newToken.storedToken.id,
        tokenId: refreshToken.id,
      });

    return {
      success: true,
      data: {
        newToken: { ...newToken },
        user: { ...user },
      },
    };
  }

  generateTokenHash(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
  generateRefreshToken(user) {
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
      process.env.JWT_REFRESH_TOKEN_SECRET || JWT_DEFAULTS.REFRESH_TOKEN_SECRET,
      {
        expiresIn:
          process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ||
          JWT_DEFAULTS.REFRESH_TOKEN_EXPIRES_IN,
      },
    );
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
      {
        expiresIn:
          process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ||
          JWT_DEFAULTS.ACCESS_TOKEN_EXPIRES_IN,
      },
    );
  }
}

export default RefreshTokenService;
