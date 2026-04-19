import User from "../models/user.model.js";

class AuthRepository {
  constructor(pool) {
    this.pool = pool;
    this.table = 'app.users';
  }


  /**
   * Update last_login information
   * 
   * 
   * @param {*} id 
   * @param {*} returning 
   * @returns 
   */
  async updateLastLogin(id, returning = "*") {
    const query = `
      UPDATE ${this.table} 
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING ${returning}
      `;
    const result = await this.pool.query(query, [id]);

    return User.fromDatabase(result.rows[0])
  }
}

export default AuthRepository;