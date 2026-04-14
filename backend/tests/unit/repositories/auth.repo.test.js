
import { describe, jest } from "@jest/globals";
import User from "../../../models/user.model.js";
import AuthRepository from "../../../repositories/auth.repo.js";

const queryMock = jest.fn();
let mockDb = {
  pool: {
    query: queryMock,
  },
  query: queryMock,
  transaction: jest.fn(async (callback) => {
    return await callback({ query: queryMock });
  }),
};

describe("AuthRepository", () => {
  let mockAuthRepository;
  let tableName = "users";
  let mockLoginData = {
    username: "testUsername",
    password: "test_password"
  }

  // Mock user data
  const mockUserData = {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    password_hash: "hashed_password_123",
    full_name: "John Doe",
    age: 25,
    is_active: true,
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
    last_login: null,
  };

  const mockUser = new User(mockUserData);

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthRepository = new AuthRepository(mockDb.pool);
  });

  describe('login', () => {
    it('should return user', async () => {
      const mockRecord = {
        id: 1,
        username: 'testUsername',
        email: 'test@test.tt'
      }
      mockDb.pool.query.mockResolvedValue({ rows: [mockRecord] });
      const res = await mockAuthRepository.login(mockLoginData);

      expect(res).toBeInstanceOf(User);
      expect(res.id).toBe(1);
      expect(res.username).toBe(mockLoginData.username)
      expect(res.email).toBe(mockRecord.email)
    })
    it('should return null', async () => {

      mockDb.pool.query.mockResolvedValue({ rows: [] });
      const res = await mockAuthRepository.login(mockLoginData);

      expect(res).toBe(null);

    })
  })
})