import db from '../config/database.js';
import { BCRYPT_ROUNDS } from '../constants/app.constants.js';
import { AUTH_ERRORS } from '../constants/error.constants.js';
import { USER_VALIDATION } from '../constants/user.constants.js';
import { sanitizeUserData } from '../utils/user.helpers.js';
import bcrypt from 'bcrypt';

class AuthService {
  constructor(AuthRepository) {
    this.authRepository = new AuthRepository(db);
  }

  async login(data) {
    this.validateLoginUserData(sanitizeUserData(data));

    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS)

    // username  doesn't exists
    const user = await this.authRepository.login({ ...data, password: passwordHash });
    if (!user) {
      throw new Error(AUTH_ERRORS.INVALID_CRIDENTIALS)
    }

    return user;
  }

  validateLoginUserData(data) {
    const hasUsername = data.username && typeof data.username === 'string';
    const hasEmail = data.email && typeof data.email === 'string';
    const hasValidPassword = data.password && typeof data.password === 'string' &&
      data.password.length >= USER_VALIDATION.PASSWORD_MIN_LENGTH &&
      data.password.length <= USER_VALIDATION.PASSWORD_MAX_LENGTH;

    // Either username or email must be provided
    if (!hasUsername && !hasEmail) {
      throw new Error(AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL)
    }

    // If username is provided, validate it
    if (hasUsername && (
      data.username.length < USER_VALIDATION.USERNAME_MIN_LENGTH
      || data.username.length > USER_VALIDATION.USERNAME_MAX_LENGTH
    )) {
      throw new Error(AUTH_ERRORS.INVALID_USERNAME)
    }

    // If email is provided, validate it
    if (hasEmail && !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/is)) {
      throw new Error(AUTH_ERRORS.INVALID_EMAIL)
    }

    // Password is always required
    if (!hasValidPassword) {
      throw new Error(AUTH_ERRORS.INVALID_PASSWORD)
    }
  }
}

export default AuthService;