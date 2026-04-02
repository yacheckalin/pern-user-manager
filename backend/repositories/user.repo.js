class UserRepository {
  constructor(pool) {
    this.pool = pool;
    this.table = "users";
  }

  async findAll() {
    const { rows } = await this.pool.query(`SELECT * FROM ${this.table}`);
    return rows;
  }

  /**
   * Create new user
   */
  async createUser(data, returning = "*") {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

    console.log(placeholders);

    const { rows } = await this.pool.query(
      `INSERT INTO ${this.table} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING ${returning}`,
      values,
    );
    return rows[0];
  }
}

export default UserRepository;
