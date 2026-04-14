import db from '../config/database.js';


class AuthService {
  constructor(AuthRepository) {
    this.authRepository = new AuthRepository(db);
  }
}

export default AuthService;