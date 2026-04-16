import RefreshToken from '../models/token.model.js';

class RefreshTokenRepository {
  constructor(pool) {
    this.pool = pool;
    this.table = 'refresh_tokens'
  }

  async findTokensByUserId(id) {
    const query = `SELECT * FROM ${this.table} WHERE user_id = $1`;
    const { rows } = await this.pool.query(query, [id])
    return RefreshToken.fromDatabaseArray(rows)
  }

  async createToken(data, returning = "*") {
    const query = `INSERT INTO ${this.table} (user_id, token_hash, expires_at, user_agent, ip_address)
    VALUES($1, $2, $3, $4, $5) RETURNING ${returning}
    `;
    const { rows } = await this.pool.query(query,
      [data.id, data.tokenHash, data.expiresAt, data.userAgent, data.ipAddress]
    );
    return RefreshToken.fromDatabase(rows[0])
  }
}

export default RefreshTokenRepository;