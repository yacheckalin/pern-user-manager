import {
  HTTP_FORBIDDEN,
  HTTP_UNAUTHORIZED,
  REFRESH_TOKEN_COOKIE_NAME,
  JWT_DEFAULTS,
  USER_DEFAULTS,
  AUTH_ERRORS,
  HTTP_INTERNAL_SERVER_ERROR,
  ACCESS_TOKEN_COOKIE_NAME,
  TOKEN_ERRORS,
} from "../constants/index.js";
import RefreshTokenService from "../services/token.service.js";
import "dotenv/config";
import ms from "ms";
import jwt from "jsonwebtoken";

const verifyRefreshToken = async (req, res, next) => {
  const refreshToken =
    req.cookies?.refreshToken || req.newRefreshToken || req.body?.refreshToken;
  if (!refreshToken) {
    next({
      message: AUTH_ERRORS.UNAUTHORIZED_ACCESS,
      statusCode: HTTP_FORBIDDEN,
    });
  }

  try {
    const tokenService = new RefreshTokenService();

    // validation with rotation goes here
    const result = await tokenService.validateWithRotate({
      refreshToken,
      userAgent: req.header("user-agent"),
      ipAddress: req.ip,
      // user: req.user
    });

    if (result.success) {
      // console.log(result.data.newToken.storedToken.toJSON())
      if (result.data.newToken) {
        const maxAgeRefreshTimestamp = ms(
          process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ||
          JWT_DEFAULTS.REFRESH_TOKEN_EXPIRES_IN,
        );

        const maxAgeAccessTimestamp = ms(
          process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ||
          JWT_DEFAULTS.ACCESS_TOKEN_EXPIRES_IN,
        );

        // Set refresh token as HTTP-only cookie
        res.cookie(
          REFRESH_TOKEN_COOKIE_NAME,
          result.data.newToken.storedToken.toJSON().tokenHash,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: maxAgeRefreshTimestamp,
            path: "/",
          },
        );

        // Set access token as HTTP-only cookie
        res.cookie(ACCESS_TOKEN_COOKIE_NAME, result.data.newToken.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: maxAgeAccessTimestamp,
          path: "/",
        });

        // insert user data into request
        req.user = {
          ...result.data.user,
          password: null,
        };
        req.newRefreshToken =
          result.data.newToken.storedToken.toJSON().tokenHash;
        req.accessToken = result.data.newToken.accessToken;
        next();
      }
    }
  } catch (error) {
    next({ statusCode: HTTP_INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const verifyAccess = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token)
    res.status(HTTP_UNAUTHORIZED).json({
      success: false,
      message: TOKEN_ERRORS.NO_ACCESS_TOKEN,
    });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET || JWT_DEFAULTS.ACCESS_TOKEN_SECRET,
    );

    // Set current user info to req.user
    req.user = decoded;

    next();
  } catch (err) {
    next({
      message: TOKEN_ERRORS.INVALID_ACCESS_TOKEN,
      statusCode: HTTP_FORBIDDEN,
    });
  }
};
export { verifyRefreshToken, verifyAccess };
