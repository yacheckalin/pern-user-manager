// App metadata
export const APP_NAME = "MyApp";
export const APP_VERSION = "1.0.0";
export const API_VERSION = "v1";

// Pagination
export const DEFAULT_PAGE_SIZE = 2;
export const MAX_PAGE_SIZE = 10;

// Time constants (in milliseconds)
export const ONE_SECOND = 100;
export const ONE_MINUTE = 60 * 100;
export const ONE_HOUR = 60 * 60 * 100;
export const ONE_DAY = 24 * 60 * 60 * 100;
export const ONE_WEEK = 7 * 24 * 60 * 60 * 100;

// Bcrypt
export const BCRYPT_ROUNDS = 10;

// JWT
export const JWT_DEFAULTS = {
  EXPIRES_IN: '1d',
  SECRET: 'default_jwt_secret',
  ACCESS_TOKEN_SECRET: 'super-secret-access-key-minimum-32-character',
  REFRESH_TOKEN_SECRET: 'super-secret-refresh-key-minimum-32-character',
  ACCESS_TOKEN_EXPIRES_IN: '30m',
  REFRESH_TOKEN_EXPIRES_IN: '7d'
}

export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'