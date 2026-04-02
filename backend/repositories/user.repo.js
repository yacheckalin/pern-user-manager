class UserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findAll() {
    const { rows } = await this.pool.query("SELECT * FROM users");
    return rows;
  }
}

export default UserRepository;
