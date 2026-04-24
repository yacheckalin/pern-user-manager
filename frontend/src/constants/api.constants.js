export const API_PREFIX = '/api/v1';


export const ERROR_MESSAGES = {
  // ─── Network / Generic ────────────────────────────────────────────────────
  NETWORK_ERROR: { title: 'No connection', description: 'Check your internet and try again.' },
  UNKNOWN_ERROR: { title: 'Something went wrong', description: 'An unexpected error occurred.' },

  // ─── User ─────────────────────────────────────────────────────────────────
  USER_NOT_FOUND: { title: 'User not found', description: 'This user may have been deleted.' },
  USER_ALREADY_ACTIVATED: { title: 'Already activated', description: 'This account is already active.' },
  USERNAME_TAKEN: { title: 'Username taken', description: 'This username is already in use. Try another one.' },
  EMAIL_TAKEN: { title: 'Email taken', description: 'An account with this email already exists.' },

  // ─── Validation — fields ──────────────────────────────────────────────────
  INVALID_USERNAME: { title: 'Invalid username', description: 'Username can only contain letters and numbers.' },
  INVALID_EMAIL: { title: 'Invalid email', description: 'Enter a valid email address.' },
  INVALID_PASSWORD: { title: 'Invalid password', description: 'Password does not meet the requirements.' },
  INVALID_AGE: { title: 'Invalid age', description: 'Age must be between 18 and 120.' },

  // ─── Validation — username length ─────────────────────────────────────────
  USERNAME_MIN_LENGTH: { title: 'Username too short', description: 'Username must be at least 3 characters.' },
  USERNAME_MAX_LENGTH: { title: 'Username too long', description: 'Username must be no longer than 30 characters.' },

  // ─── Validation — password rules ──────────────────────────────────────────
  PASSWORD_MIN_LENGTH: { title: 'Password too short', description: 'Password must be at least 6 characters.' },
  PASSWORD_MAX_LENGTH: { title: 'Password too long', description: 'Password must be no longer than 72 characters.' },
  INVALID_NEW_PASSWORD: { title: 'Invalid new password', description: 'New password does not meet the requirements.' },
  INVALID_OLD_PASSWORD: { title: 'Invalid old password', description: 'Old password does not meet the requirements.' },
  INVALID_CONFIRM_PASSWORD: { title: 'Passwords do not match', description: 'Confirm password must match the new password.' },
  OLD_PASSWORD_INVALID: { title: 'Wrong current password', description: 'The current password you entered is incorrect.' },
  NEW_PASSWORD_THE_SAME: { title: 'Same password', description: 'New password must differ from the current one.' },

  // ─── Auth — credentials ───────────────────────────────────────────────────
  INVALID_USERNAME_OR_EMAIL: { title: 'User not found', description: 'No account found with this username or email.' },
  INVALID_CRIDENTIALS: { title: 'Wrong credentials', description: 'Username or password is incorrect.' },
  WRONG_IP: { title: 'Access denied', description: 'Login attempt from an unrecognised IP address.' },

  // ─── Auth — token ─────────────────────────────────────────────────────────
  NO_ACCESS_TOKEN: { title: 'Not authenticated', description: 'Please log in to continue.' },
  INVALID_ACCESS_TOKEN: { title: 'Invalid token', description: 'Your session token is invalid. Please log in again.' },
  TOKEN_EXPIRED: { title: 'Session expired', description: 'Your session has expired. Please log in again.' },
  TOKEN_NOT_FOUND: { title: 'Session not found', description: 'No active session found. Please log in.' },
  TOKEN_REVOKED: { title: 'Session revoked', description: 'Your session was terminated. Please log in again.' },

  // ─── HTTP fallbacks (по статусу если code не пришёл) ─────────────────────
  UNAUTHORIZED: { title: 'Session expired', description: 'Please log in again.' },
  FORBIDDEN: { title: 'Access denied', description: 'You don\'t have permission for this.' },
  VALIDATION_ERROR: { title: 'Invalid data', description: 'Check the form and try again.' },
  USER_ALREADY_EXISTS: { title: 'Already exists', description: 'This email or username is already taken.' },
}

export const FALLBACK_ERROR = { title: 'Something went wrong', description: 'An unexpected error occurred.' }