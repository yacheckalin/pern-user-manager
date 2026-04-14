import User from "../models/user.model";

class AuthRepository {
  constructor(pool) {
    this.pool = pool;
    this.table = 'users';
  }

  /**
   * Get user info by (username || email) AND password
   * 
   * @param {*} data {username, email, password}
   * @returns User
   */
  async login(data, returning = "*") {
    const { username, email, password } = data;
    const { rows } = await this.pool.query(`SELECt * FROM ${this.table}
       WHERE (username = $1 OR email = $2) AND password_hash = $3 RETURNING ${returning}`,
      [username, email, password]);
    return User.fromDatabase(rows[0])
  }
}

export default AuthRepository;