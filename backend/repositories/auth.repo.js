class AuthRepository {
  constructor(pool) {
    this.pool = pool;
    this.table = 'users';
  }
}

export default AuthRepository;