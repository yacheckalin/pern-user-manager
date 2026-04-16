import { JWT_DEFAULTS, ONE_WEEK, REFRESH_TOKEN_COOKIE_NAME } from "../constants/app.constants.js";
import { AUTH_ERRORS, TOKEN_ERRORS } from "../constants/error.constants.js";
import { HTTP_BAD_REQUEST, HTTP_FORBIDDEN, HTTP_INTERNAL_SERVER_ERROR, HTTP_OK, HTTP_UNAUTHORIZED } from "../constants/http.constants.js";
import { USER_MESSAGES } from "../constants/user.constants.js";
import AuthService from "../services/auth.service.js";
import ms from 'ms';
class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res, next) {
    try {
      const { accessToken, user, storedToken } = await this.authService.login({
        ...req.body,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      // Set refresh token as HTTP-only cookie
      res.cookie(REFRESH_TOKEN_COOKIE_NAME, storedToken.tokenHash, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: ms(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || JWT_DEFAULTS.REFRESH_TOKEN_EXPIRES_IN)
      });

      res.status(HTTP_OK).json({
        success: true,
        message: USER_MESSAGES.AUTHORIZED,
        data: { accessToken, user }
      })
    } catch (error) {
      // Handle validation errors
      if (
        error.message === AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL ||
        error.message === AUTH_ERRORS.INVALID_USERNAME ||
        error.message === AUTH_ERRORS.INVALID_EMAIL ||
        error.message === AUTH_ERRORS.INVALID_PASSWORD
      ) {
        next({ message: error.message, statusCode: HTTP_BAD_REQUEST })
      }

      // Handle unauthorized errors
      if (error.message === AUTH_ERRORS.INVALID_CRIDENTIALS) {
        next({ message: error.message, statusCode: HTTP_UNAUTHORIZED })
      }
      next({ message: error.message, statusCode: HTTP_INTERNAL_SERVER_ERROR })
    }
  }

  async logout(req, res, next) {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      //TODO: add to blacklist and rotate refresh token in DB
      try {
        await this.authService.logout({ userId: req.user.id, tokenHash: refreshToken });

        res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);

        res.status(HTTP_OK).json({
          success: true,
          message: USER_MESSAGES.LOGOUT
        })

      } catch (error) {
        if (error.message === TOKEN_ERRORS.TOKEN_NOT_FOUND ||
          error.message === TOKEN_ERRORS.TOKEN_EXPIRED ||
          error.message === TOKEN_ERRORS.TOKEN_REVOKED
        ) {
          next({ message: error.message, statusCode: HTTP_UNAUTHORIZED })
        }
        next({ message: error.message, statusCode: HTTP_INTERNAL_SERVER_ERROR })
      }
    }

  }
}

export default AuthController;