class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.passwordHash = data.password_hash;
    this.age = data.age;
    this.isActive = data.is_active;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.activatedAt = data.activated_at;
    this.lastLogin = data.last_login;
  }

  isAdult() {
    return this.age >= 18;
  }

  canLogin() {
    return this.isActive === true;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      age: this.age,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      activatedAt: this.activatedAt,
      lastLogin: this.lastLogin,
    };
  }

  static fromDatabase(row) {
    if (!row) return null;
    return new User(row);
  }

  static fromDatabaseArray(rows) {
    return rows.length === 0 ? [] : rows.map((row) => new User(row));
  }
}

export default User;
