import {
  ACCESS_TOKEN_COOKIE_NAME,
  JWT_DEFAULTS,
  ONE_WEEK,
  REFRESH_TOKEN_COOKIE_NAME,
  TOKEN_MESSAGES,
} from "../constants/app.constants.js";
import { AUTH_ERRORS, TOKEN_ERRORS } from "../constants/error.constants.js";
import {
  HTTP_BAD_REQUEST,
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_OK,
  HTTP_UNAUTHORIZED,
} from "../constants/http.constants.js";
import { USER_MESSAGES } from "../constants/user.constants.js";
import AuthService from "../services/auth.service.js";
import ms from "ms";
class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res, next) {
    try {
      const { accessToken, user, storedToken } = await this.authService.login({
        ...req.body,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      // Set refresh token as HTTP-only cookie
      res.cookie(REFRESH_TOKEN_COOKIE_NAME, storedToken.tokenHash, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: ms(
          process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ||
            JWT_DEFAULTS.REFRESH_TOKEN_EXPIRES_IN,
        ),
      });

      // Set access token as HTTP-only cookie
      res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ms(
          process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ||
            JWT_DEFAULTS.ACCESS_TOKEN_EXPIRES_IN,
        ),
        path: "/",
      });

      res.status(HTTP_OK).json({
        success: true,
        message: USER_MESSAGES.AUTHORIZED,
        data: { accessToken, user },
      });
    } catch (error) {
      // Handle validation errors
      if (
        error.message === AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL ||
        error.message === AUTH_ERRORS.INVALID_USERNAME ||
        error.message === AUTH_ERRORS.INVALID_EMAIL ||
        error.message === AUTH_ERRORS.INVALID_PASSWORD
      ) {
        next({ message: error.message, statusCode: HTTP_BAD_REQUEST });
      }

      // Handle unauthorized errors
      if (error.message === AUTH_ERRORS.INVALID_CRIDENTIALS) {
        next({ message: error.message, statusCode: HTTP_UNAUTHORIZED });
      }
      next({ message: error.message, statusCode: HTTP_INTERNAL_SERVER_ERROR });
    }
  }

  async logout(req, res, next) {
    const refreshToken = req.newRefreshToken || req.cookies?.refreshToken;

    try {
      if (refreshToken) {
        await this.authService.logout({
          userId: req.user.id,
          tokenHash: refreshToken,
        });
      }

      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: ms(
          process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ||
            JWT_DEFAULTS.REFRESH_TOKEN_EXPIRES_IN,
        ),
      });
      res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ms(
          process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ||
            JWT_DEFAULTS.ACCESS_TOKEN_EXPIRES_IN,
        ),
        path: "/",
      });

      res.status(HTTP_OK).json({
        success: true,
        message: USER_MESSAGES.LOGOUT,
      });
    } catch (error) {
      const posibleErrors = [
        TOKEN_ERRORS.TOKEN_NOT_FOUND,
        TOKEN_ERRORS.TOKEN_EXPIRED,
        TOKEN_ERRORS.TOKEN_REVOKED,
        AUTH_ERRORS.UNAUTHORIZED_ACCESS,
      ];
      if (posibleErrors.includes(error.message)) {
        next({ message: error.message, statusCode: HTTP_UNAUTHORIZED });
      }
      next(error);
    }
  }

  async refresh(req, res, next) {
    const accessToken = req.accessToken;

    res.status(HTTP_OK).json({
      success: true,
      message: TOKEN_MESSAGES.ROTATED,
      data: { accessToken },
    });
  }
}

export default AuthController;
