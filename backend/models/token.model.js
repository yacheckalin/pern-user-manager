class RefreshToken {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.tokenHash = data.token_hash;
    this.expiresAt = data.expires_at;
    this.createdAt = data.created_at;
    this.revokedAt = data.revoked_at;
    this.userAgent = data.user_agent;
    this.ipAddress = data.ip_address;
    this.replacedByTokenId = data.replaced_by_token_id;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      tokenHash: this.tokenHash,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
      revokedAt: this.revokedAt,
      userAgent: this.userAgent,
      ipAddress: this.ipAddress,
      replacedByTokenId: this.replacedByTokenId,
    };
  }

  static fromDatabase(row) {
    if (!row) return null;
    return new RefreshToken(row);
  }

  static fromDatabaseArray(rows) {
    return rows.length === 0 ? [] : rows.map((row) => new RefreshToken(row));
  }
}

export default RefreshToken;
