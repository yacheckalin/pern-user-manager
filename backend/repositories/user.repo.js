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
   * Find user by id
   *
   * @param {*} id
   * @returns
   */
  async findUserById(id) {
    const { rows } = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE id = $1`,
      [id],
    );
    return User.fromDatabase(rows[0]);
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
      [username],
    );
    return User.fromDatabase(rows[0]);
  }

  /**
   * Find user by email
   *
   * @param {email} email
   * @returns User | null
   */
  async findUserByEmail(email) {
    const { rows } = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE email = $1`,
      [email],
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

  /**
   * Update user by id
   *
   *
   * @param {*} id
   * @param {*} data
   * @param {*} returning
   * @returns
   */
  async updateUser(id, data, returning = "*") {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys
      .map((column, index) => `${column} = $${index + 2}`)
      .join(", ");

    const query = `UPDATE ${this.table}
       SET ${placeholders}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING ${returning}`;

    const result = await this.pool.query(query, [id, ...values]);
    return User.fromDatabase(result.rows[0]);
  }

  /**
   * Update user password by id
   *
   * @param {*} id
   * @param {*} data - new password
   * @param {*} returning
   * @returns
   */
  async updateUserPassword(id, data, returning = "*") {
    const query = `UPDATE ${this.table} SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING ${returning}`;

    const result = await this.pool.query(query, [data.password, id]);
    return User.fromDatabase(result.rows[0]);
  }
}

export default UserRepository;
