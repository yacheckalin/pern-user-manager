import {
  HTTP_FORBIDDEN,
  HTTP_UNAUTHORIZED,
  REFRESH_TOKEN_COOKIE_NAME,
  JWT_DEFAULTS,
  AUTH_ERRORS,
  HTTP_INTERNAL_SERVER_ERROR,
  ACCESS_TOKEN_COOKIE_NAME,
  TOKEN_ERRORS,
  USER_CODES,
} from "../constants/index.js";
import RefreshTokenService from "../services/token.service.js";
import "dotenv/config";
import ms from "ms";
import jwt from "jsonwebtoken";
import ApiError from "../errors/api.error.js";

const verifyRefreshToken = async (req, res, next) => {
  const refreshToken =
    req.cookies?.refreshToken || req.newRefreshToken || req.body?.refreshToken;
  if (!refreshToken) {
    throw new ApiError({ message: AUTH_ERRORS.UNAUTHORIZED_ACCESS, status: HTTP_FORBIDDEN })
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
    throw new ApiError({ message: error, status: HTTP_INTERNAL_SERVER_ERROR })
  }
};

const verifyAccess = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token)
    throw new ApiError({
      message: TOKEN_ERRORS.NO_ACCESS_TOKEN,
      code: USER_CODES.NO_ACCESS_TOKEN,
      status: HTTP_UNAUTHORIZED
    })

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET || JWT_DEFAULTS.ACCESS_TOKEN_SECRET,
    );

    // Set current user info to req.user
    req.user = decoded;

    next();
  } catch (err) {

    throw new ApiError({
      message: TOKEN_ERRORS.INVALID_ACCESS_TOKEN,
      code: USER_CODES.INVALID_ACCESS_TOKEN,
      status: HTTP_FORBIDDEN
    })
  }
};
export { verifyRefreshToken, verifyAccess };
