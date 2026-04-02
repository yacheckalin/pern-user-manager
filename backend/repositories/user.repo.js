import User from "../models/user.model.js";

class UserRepository {
  constructor(pool) {
    this.pool = pool;
    this.table = "users";
  }

  async findAll() {
    const { rows } = await this.pool.query(`SELECT * FROM ${this.table}`);
    return User.fromDatabaseArray(rows);
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
