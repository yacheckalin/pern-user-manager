import {
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_OK,
  HTTP_UNAUTHORIZED,
  USER_MESSAGES,
  AUTH_ERRORS,
  TOKEN_ERRORS,
  ACCESS_TOKEN_COOKIE_NAME,
  JWT_DEFAULTS,
  REFRESH_TOKEN_COOKIE_NAME,
  TOKEN_MESSAGES,
} from "../constants/index.js";
import AuthService from "../services/auth.service.js";
import ms from "ms";
import asyncHandler from "../middleware/async-handler.js";
class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  login = asyncHandler(async (req, res, next) => {
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
  })

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
