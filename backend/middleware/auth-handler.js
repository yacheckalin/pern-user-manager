import {
  HTTP_FORBIDDEN,
  HTTP_UNAUTHORIZED,
  REFRESH_TOKEN_COOKIE_NAME,
  JWT_DEFAULTS,
  USER_DEFAULTS,
  AUTH_ERRORS,
  HTTP_INTERNAL_SERVER_ERROR,
  ACCESS_TOKEN_COOKIE_NAME,
} from "../constants/index.js";
import RefreshTokenService from "../services/token.service.js";
import dotenv from "dotenv";
import ms from "ms";

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

export default verifyRefreshToken;
