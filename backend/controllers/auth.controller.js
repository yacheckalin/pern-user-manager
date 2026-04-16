import { ONE_WEEK } from "../constants/app.constants.js";
import { AUTH_ERRORS } from "../constants/error.constants.js";
import { HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR, HTTP_OK, HTTP_UNAUTHORIZED } from "../constants/http.constants.js";
import { USER_MESSAGES } from "../constants/user.constants.js";
import AuthService from "../services/auth.service.js";

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
      res.cookie('refreshToken', storedToken.tokenHash, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || ONE_WEEK
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

  logout(req, res, next) {
    const refreshToken = req.cookie?.refreshToken;

    if (refreshToken) {
      //TODO: add to blacklist or remove from DB
    }
    res.clearCookie('refreshToken');
    res.status(HTTP_OK).json({
      success: true,
      message: USER_MESSAGES.LOGOUT
    })

  }
}

export default AuthController;