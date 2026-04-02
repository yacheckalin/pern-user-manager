import User from "../models/user.model.js";

class UserRepository {
  constructor(pool) {
    this.pool = pool;
    this.table = "users";
  }

  /**
   * Find all users
   *
   * @returns User[]
   */
  async findAll() {
    const { rows } = await this.pool.query(`SELECT * FROM ${this.table}`);
    return User.fromDatabaseArray(rows);
  }

  /**
   * Find user by username
   *
   * @param {username} user name
   * @returns User | null
   */
  async findUserByName(username) {
    const { rows } = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE username = $1`,
      username,
    );
    return User.fromDatabase(rows[0]);
  }

  /**
   * Create new user
   */
  async createUser(data, returning = "*") {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

    const { rows } = await this.pool.query(
      `INSERT INTO ${this.table} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING ${returning}`,
      values,
    );
    return User.fromDatabase(rows[0]);
  }
}

export default UserRepository;
