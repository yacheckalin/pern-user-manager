import RefreshToken from "../models/token.model.js";

class RefreshTokenRepository {
  constructor(pool) {
    this.pool = pool;
    this.table = "app.refresh_tokens";
  }

  async findTokensByUserId(id) {
    const query = `SELECT * FROM ${this.table} WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > NOW()`;
    const { rows } = await this.pool.query(query, [id]);
    return RefreshToken.fromDatabaseArray(rows);
  }

  async findTokenByHash(token) {
    const query = `SELECT * FROM ${this.table} WHERE token_hash = $1`;
    const { rows } = await this.pool.query(query, [token]);
    return RefreshToken.fromDatabase(rows[0]);
  }

  async createToken(data, returning = "*") {
    const query = `INSERT INTO ${this.table} (user_id, token_hash, expires_at, user_agent, ip_address)
    VALUES($1, $2, $3, $4, $5) RETURNING ${returning}
    `;
    const { rows } = await this.pool.query(query, [
      data.id,
      data.tokenHash,
      data.expiresAt,
      data.userAgent,
      data.ipAddress,
    ]);
    return RefreshToken.fromDatabase(rows[0]);
  }

  async revokeToken(data, returning = "*") {
    const query = `UPDATE ${this.table} SET revoked_at = NOW() WHERE user_id = $1 AND token_hash = $2 RETURNING ${returning}`;
    const { rows } = await this.pool.query(query, [
      data.userId,
      data.tokenHash,
    ]);
    return RefreshToken.fromDatabase(rows[0]);
  }

  async revokeAndReplaceToken(data, returning = "*") {
    const query = `UPDATE ${this.table} SET revoked_at = NOW(), replaced_by_token_id = $1 WHERE id = $2 RETURNING ${returning}`;
    const { rows } = await this.pool.query(query, [
      data.newTokenId,
      data.tokenId,
    ]);
    return RefreshToken.fromDatabase(rows[0]);
  }

  async logoutTokenByUserId(data, returning = "*") {
    const query = `UPDATE ${this.table} SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL RETURNING ${returning}`;
    const { rows } = await this.pool.query(query, [data.userId]);

    return RefreshToken.fromDatabaseArray(rows);
  }
}

export default RefreshTokenRepository;
