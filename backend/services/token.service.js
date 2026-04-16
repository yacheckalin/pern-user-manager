import db from '../config/database.js';
import RefreshTokenRepository from '../repositories/token.repo.js';
import { JWT_DEFAULTS, ONE_WEEK } from '../constants/index.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import ms from 'ms';
import jwt from 'jsonwebtoken'

class RefreshTokenService {
  constructor() {
    this.refreshTokenRepository = new RefreshTokenRepository(db);
  }

  async createToken(data) {
    // The data has already been validated in AuthService
    const accessToken = this.generateAccessToken(data);
    const refreshToken = this.generateRefreshToken(data);

    // add to DB new data for existing user 

    const storedToken = await this.refreshTokenRepository.createToken({
      ...data,
      tokenHash: this.generateTokenHash(refreshToken),
      expiresAt: new Date(Date.now() + ms(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || ONE_WEEK)),
    })

    return { accessToken, refreshToken, storedToken }

  }

  generateTokenHash(token) {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

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
}

export default RefreshTokenService