import User from "../models/user.model.js";
import logger from "../logger.js";

class UserRepository {
  constructor(pool) {
    this.pool = pool;
    this.table = "app.users";
  }

  /**
   * Find all users
   *
   * @returns User[]
   */
  async findAll({ search, activated, age, logged, createdAt }) {
    const conditions = [];
    const params = [];
    let idx = 1;
    // search conditions
    if (search) {
      conditions.push(` (u.username  ILIKE $${idx} OR u.email ILIKE $${idx}) `);
      params.push(`%${search}%`);
      idx++;
    }

    if (activated) {
      conditions.push(` u.is_active = $${idx} `);
      params.push(activated);
      idx++;
    }

    if (age) {
      conditions.push(` u.age >= $${idx} `);
      params.push(age);
      idx++;
    }

    if (createdAt) {
      const startDate = new Date(createdAt);
      startDate.setHours(0, 0, 0, 0);

      const nextDay = new Date(startDate);

      nextDay.setDate(nextDay.getDate() + 1);
      conditions.push(` u.created_at >= $${idx} `);
      params.push(startDate);
      idx++;

      conditions.push(` u.created_at <= $${idx} `);
      params.push(nextDay);
      idx++;
    }

    //TODO: add sorting conditions here
    //TODO: add pagination conditions here

    const whereClause = logged
      ? ` WHERE has_active_session = ${logged.toString()}`
      : "";

    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "";

    const dataQuery = `WITH users_with_sessions AS (
            SELECT
              u.*,
              EXISTS (
                SELECT 1
                FROM app.refresh_tokens rt
                WHERE rt.user_id = u.id
                  AND rt.revoked_at IS NULL
                  AND rt.expires_at > NOW()
              ) as has_active_session
            FROM ${this.table} u ${where}
          )
          SELECT *
          FROM users_with_sessions
          ${whereClause}`;
    const countQuery = `
    SELECT COUNT(DISTINCT u.id) as total
    FROM ${this.table} u`;

    const [dataResult, countResult] = await Promise.all([
      this.pool.query(dataQuery, [...params]), // with pagination
      this.pool.query(countQuery), // without pagination
    ]);

    return {
      items: User.fromDatabaseArray(dataResult.rows),
      total: countResult.rows[0].total,
    };
  }

  /**
   * Get User Statistics by User Id
   * - active users
   * - not active users
   * - logged in
   * - logged out
   * 
   * @param {*} id 
   */
  async getUsersStatistics() {
    const query = `WITH users_with_sessions AS (
    SELECT
        u.is_active,
        EXISTS (
            SELECT 1
            FROM app.refresh_tokens rt
            WHERE rt.user_id = u.id
              AND rt.revoked_at IS NULL
              AND rt.expires_at > NOW()
        ) AS has_active_session
    FROM ${this.table} u 
)
SELECT
    COUNT(*) FILTER (WHERE is_active IS TRUE) AS activated,
    COUNT(*) FILTER (WHERE is_active IS FALSE) AS not_activated,
    COUNT(*) FILTER (WHERE has_active_session IS FALSE) AS not_logged_in,
    COUNT(*) FILTER (WHERE has_active_session IS TRUE) AS logged_in
FROM users_with_sessions;`;

    const { rows } = await this.pool.query(query);
    return rows[0]
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

  /**
   * Delete user by id
   *
   *
   * @param {*} id
   * @returns
   */
  async deleteUserById(id) {
    const { rows } = await this.pool.query(
      `DELETE FROM ${this.table} WHERE id = $1 RETURNING id`,
      [id],
    );
    return User.fromDatabase(rows[0]);
  }

  /**
   * Activate user by id
   *
   * @param {*} id
   * @param {*} returning
   * @returns
   */
  async activateUserById(id, returning = "*") {
    const { rows } = await this.pool.query(
      `UPDATE ${this.table}
        SET is_active=TRUE, updated_at = CURRENT_TIMESTAMP,
            activated_at = COALESCE(activated_at, CURRENT_TIMESTAMP)
        WHERE id = $1
        RETURNING ${returning}`,
      [id],
    );
    return User.fromDatabase(rows[0]);
  }
}

export default UserRepository;
