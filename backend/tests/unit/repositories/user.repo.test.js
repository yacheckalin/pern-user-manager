import { jest } from "@jest/globals";
import User from "../../../models/user.model.js";
import UserRepository from "../../../repositories/user.repo.js";

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

describe("UserRepository", () => {
  let mockUserRepository;
  let tableName = "app.users";

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
    mockUserRepository = new UserRepository(mockDb.pool);
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockRecord = {
        id: 1,
        username: 'john_doe',
        email: "john@example.com"
      };
      mockDb.pool.query.mockResolvedValue({ rows: [mockRecord] });
      const result = await mockUserRepository.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(1);
      expect(result[0].username).toBe('john_doe');
      expect(result[0].email).toBe('john@example.com')
    })

    it("should return empty array when no users", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [] });
      const result = await mockUserRepository.findAll();
      expect(result).toBeDefined
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0)
    });
  })

  describe("findUserById", () => {
    it("should return user when found", async () => {
      const mockRecord = {
        id: 1,
        username: "john_doe",
        email: "john@example.com",
      };
      mockDb.pool.query.mockResolvedValue({ rows: [mockRecord] });
      const result = await mockUserRepository.findUserById(1);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(1);
      expect(result.username).toBe("john_doe");
      expect(result.email).toBe("john@example.com");
    });

    it("should return null when user not found", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [] });
      const result = await mockUserRepository.findUserById(999);
      expect(result).toBeNull();
    });

    it("should find record by id with default columns", async () => {
      const mockRecord = { id: 1, name: "Test" };
      mockDb.pool.query.mockResolvedValue({ rows: [mockRecord] });
      const result = await mockUserRepository.findUserById(1);
      expect(mockDb.pool.query).toHaveBeenCalledWith(
        expect.stringContaining(`SELECT * FROM ${tableName}`),
        [1],
      );
      expect(result).toEqual(User.fromDatabase(mockRecord));
    });
  });

  describe("findUserByName", () => {
    it("should return null when user not found", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [] });
      const result = await mockUserRepository.findUserByName("name");
      expect(result).toBeNull();
    });

    it("should find record by name with default columns", async () => {
      const mockRecord = { id: 1, name: "test", email: "test@test.tt" };
      mockDb.pool.query.mockResolvedValue({ rows: [mockRecord] });
      const res = await mockUserRepository.findUserByName("test");
      expect(mockDb.pool.query).toHaveBeenCalledWith(
        expect.stringContaining(`SELECT * FROM ${tableName} WHERE`),
        ["test"],
      );
      expect(res).toEqual(User.fromDatabase(mockRecord));
    });

    it("should return a user when found", async () => {
      const mockRecord = {
        id: 1,
        username: "john_doe",
        email: "john@example.com",
      };
      mockDb.pool.query.mockResolvedValue({ rows: [mockRecord] });
      const result = await mockUserRepository.findUserByName("john_doe");

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(1);
      expect(result.username).toBe("john_doe");
      expect(result.email).toBe("john@example.com");
    });
  });
  describe("findUserByEmail", () => {
    it("should return null when user not found", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [] });
      const result = await mockUserRepository.findUserByEmail("name@name.com");
      expect(result).toBeNull();
    });

    it("should find record by name with default columns", async () => {
      const mockRecord = { id: 1, name: "test", email: "test@test.tt" };
      mockDb.pool.query.mockResolvedValue({ rows: [mockRecord] });
      const res = await mockUserRepository.findUserByEmail("name@name.com");
      expect(mockDb.pool.query).toHaveBeenCalledWith(
        expect.stringContaining(`SELECT * FROM ${tableName} WHERE`),
        ["name@name.com"],
      );
      expect(res).toEqual(User.fromDatabase(mockRecord));
    });

    it("should return a user when found", async () => {
      const mockRecord = {
        id: 1,
        username: "john_doe",
        email: "john@example.com",
      };
      mockDb.pool.query.mockResolvedValue({ rows: [mockRecord] });
      const result =
        await mockUserRepository.findUserByEmail("john@example.com");

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(1);
      expect(result.username).toBe("john_doe");
      expect(result.email).toBe("john@example.com");
    });
  });

  describe("createUser", () => {
    it("should create user", async () => {
      const data = {
        username: "username",
        password_hash: "password_hash",
        is_active: true,
        age: 20,
      };
      mockDb.pool.query.mockResolvedValue({ rows: [data] });

      const result = await mockUserRepository.createUser(data);

      expect(result).toBeInstanceOf(User);
      expect(result.username).toBe("username");
      expect(result.isActive).toBe(true);
      expect(result.age).toBe(20);
    });

    it("should insert a record", async () => {
      const mockRecord = { id: 1, name: "test", email: "test@test.tt" };
      mockDb.pool.query.mockResolvedValue({ rows: [mockRecord] });
      const res = await mockUserRepository.createUser("name@name.com");
      expect(res).toEqual(User.fromDatabase(mockRecord));
    });
  });

  describe("updateUser", () => {
    it("should update user properly", async () => {
      const data = { username: "new_username" };
      mockDb.pool.query.mockResolvedValue({ rows: [data] });
      const res = await mockUserRepository.updateUser(1, data);
      expect(res).toBeInstanceOf(User);
      expect(res.username).toBe("new_username");
    });

    it("should return null when user not found", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [] });
      const result = await mockUserRepository.updateUser(100, {
        username: "new_username",
      });
      expect(result).toBeNull();
    });
  });

  describe("updateUserPassword", () => {
    it("should update user password properly", async () => {
      const data = { password_hash: "new_password_hash" };
      mockDb.pool.query.mockResolvedValue({
        rows: [{ id: 1, password_hash: "new_password_hash" }],
      });
      const result = await mockUserRepository.updateUserPassword(1, data);
      expect(result.id).toBe(1);
      expect(result).toBeInstanceOf(User);
      expect(result.passwordHash).toBe("new_password_hash");
    });

    it("should return null when not found", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [] });
      const result = await mockUserRepository.updateUserPassword(1, {
        password_hash: "new_password_hash",
      });
      expect(result).toBeNull();
    });
  });

  describe("deleteUserById", () => {
    it("should return null when user not found", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [] });
      const result = await mockUserRepository.deleteUserById(1000);
      expect(result).toBeNull();
    });

    it("should find deleted record by name with default columns", async () => {
      const mockRecord = { id: 1, name: "test", email: "test@test.tt" };
      mockDb.pool.query.mockResolvedValue({ rows: [mockRecord] });
      const res = await mockUserRepository.deleteUserById(1);
      expect(mockDb.pool.query).toHaveBeenCalledWith(
        expect.stringContaining(`DELETE FROM ${tableName} WHERE`),
        [1],
      );
      expect(res).toEqual(User.fromDatabase(mockRecord));
    });

    it("should delete a user when found", async () => {
      const mockRecord = {
        id: 1,
        username: "john_doe",
        email: "john@example.com",
      };
      mockDb.pool.query.mockResolvedValue({ rows: [mockRecord] });
      const result = await mockUserRepository.deleteUserById(1);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(1);
      expect(result.username).toBe("john_doe");
      expect(result.email).toBe("john@example.com");
    });
  });

  describe("activateUserById", () => {
    it("should return null when user not found", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [] });
      const result = await mockUserRepository.activateUserById(1);
      expect(result).toBeNull();
    });

    it("should activate record by id with default columns", async () => {
      const mockRecord = { id: 1, name: "test", email: "test@test.tt" };
      mockDb.pool.query.mockResolvedValue({ rows: [mockRecord] });
      const res = await mockUserRepository.findUserByName("test");
      expect(res).toEqual(User.fromDatabase(mockRecord));
    });

    it("should return a user when activated", async () => {
      const mockRecord = {
        id: 1,
        username: "john_doe",
        email: "john@example.com",
      };
      mockDb.pool.query.mockResolvedValue({ rows: [mockRecord] });
      const result = await mockUserRepository.activateUserById(1);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(1);
      expect(result.username).toBe("john_doe");
      expect(result.email).toBe("john@example.com");
    });
  });
});
