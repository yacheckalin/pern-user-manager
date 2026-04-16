import { HTTP_FORBIDDEN, HTTP_UNAUTHORIZED, REFRESH_TOKEN_COOKIE_NAME, JWT_DEFAULTS } from "../constants/index.js";
import RefreshTokenService from "../services/token.service.js";
import dotenv from 'dotenv';
import ms from 'ms';


const authRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!refreshToken) {
    throw new Error(HTTP_UNAUTHORIZED)
  }

  try {
    const tokenService = new RefreshTokenService();

    // validation with rotation goes here
    const result = await tokenService.validateWithRotate({
      refreshToken,
      userAgent: req.header('user-agent'),
      ipAddress: req.ip,
      // user: req.user
    });

    if (result.success) {
      // console.log(result.data.newToken.storedToken.toJSON())
      if (result.data.newToken) {

        const maxAgeTimestamp = ms(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || JWT_DEFAULTS.REFRESH_TOKEN_EXPIRES_IN)

        // Set refresh token as HTTP-only cookie
        res.cookie(REFRESH_TOKEN_COOKIE_NAME, result.data.newToken.storedToken.toJSON().tokenHash, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: maxAgeTimestamp
        });

        // insert user data into request
        req.user = {
          ...result.data.user,
          password: null
        }
        next();
      }

    }
    throw new Error(HTTP_FORBIDDEN);

  } catch (error) {
    throw new Error(HTTP_FORBIDDEN)
  }
}

export default authRefreshToken;