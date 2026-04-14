import User from "../models/user.model.js";

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
    const filter = [];
    const params = [];
    if (username) {
      filter.push(' username = $1');
      params.push(username)
    }
    if (email) {
      filter.push(' email = $1')
      params.push(email)
    }

    filter.push(' password_hash = $2 ');
    params.push(password);

    const { rows } = await this.pool.query(
      `SELECT ${returning} FROM ${this.table} WHERE ${filter.join(' AND ')}`,
      params,
    );

    return User.fromDatabase(rows[0]);

  }
}

export default AuthRepository;