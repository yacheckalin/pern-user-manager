// User errors
export const USER_ERRORS = {
  NOT_FOUND: "User not found",
  ALREADY_EXISTS: "User already exists",
  EMAIL_TAKEN: "Email is already registered",
  USERNAME_TAKEN: "Username is already taken",
  INVALID_AGE: "Age must be between 13 and 150",
  INVALID_EMAIL: "Please provide a valid email address",
  INVALID_USERNAME: "Username must be at least 3 characters",
  INVALID_PASSWORD: "Password must be at least 6 characters",
  INVALID_NEW_PASSWORD: "New password must be at least 6 characters",
  INVALID_OLD_PASSWORD: "Old password must be at least 6 characters",
  INVALID_CONFIRM_PASSWORD: "Confirm password is not valid",
  OLD_PASSWORD_INVALID: "Old password is not valid",
  NEW_PASSWORD_THE_SAME: "New password is the same as old one",
  ALREADY_ACTIVATED: "User has already activated",
};

// Database errors
export const DB_ERRORS = {
  CONNECTION_FAILED: "Database connection failed",
  QUERY_FAILED: "Database query failed",
};

// Authentication errors
export const AUTH_ERRORS = {
  INVALID_CRIDENTIALS: "Invalid cridentials",
  INVALID_USERNAME_OR_EMAIL: "Invalid username or email",
  INVALID_EMAIL: "Invalid email",
  INVALID_USERNAME: "Invalid username",
  INVALID_PASSWORD: "Invalid password",
  UNAUTHORIZED_ACCESS: "Unauthorized access detected",
};

// Tokens Errors
export const TOKEN_ERRORS = {
  TOKEN_EXPIRED: "Token has expired",
  TOKEN_NOT_FOUND: "Token not found",
  TOKEN_REVOKED: "Token revoked - possible token theft detected",
  NO_ACCESS_TOKEN: "No access token",
  INVALID_ACCESS_TOKEN: "Invalid access token",
};

export const WRONG_IP = "Wrong IP Address";
