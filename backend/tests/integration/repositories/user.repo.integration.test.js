import db from "../../../config/database.js";
import UserRepository from "../../../repositories/user.repo.js";

import {
  setupTestDatabase,
  teardownTestDatabase,
} from "../../setup/test.database.js";

describe("UserRepository - Integration Tests", () => {
  let userRepository;

  beforeAll(async () => {
    await setupTestDatabase();
    userRepository = new UserRepository(db);

    console.log("Checking DB connection...");
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_PORT:", process.env.DB_PORT);

    try {
      // Attempt a simple query to see if the network is alive
      await db.query("SELECT 1");
      console.log("Database is REACHABLE!");
    } catch (err) {
      console.error("Database is UNREACHABLE:", err.message);
    }
  });

  afterAll(async () => {
    await teardownTestDatabase();
    await db.end();
  });

  beforeEach(async () => {
    // Clean up before each test
    await db.query("TRUNCATE TABLE app.users CASCADE");
  });

  describe("create", () => {
    it("should create a user in database", async () => {
      const userData = {
        username: "integration_test",
        email: "test@example.com",
        password_hash: "hashed_password",
        age: 25,
      };

      const result = await userRepository.createUser(userData);

      expect(result).toHaveProperty("id");
      expect(result.username).toBe("integration_test");

      // Verify in database
      const dbResult = await db.query("SELECT * FROM app.users WHERE id = $1", [
        result.id,
      ]);
      expect(dbResult.rows[0]).toBeTruthy();
    });
  });

  describe("findByEmail", () => {
    it("should find user by email", async () => {
      await db.query(
        `INSERT INTO app.users (username, email, password_hash)
                 VALUES ($1, $2, $3)`,
        ["testuser", "find@example.com", "hash"],
      );

      const user = await userRepository.findUserByEmail("find@example.com");

      expect(user).toBeTruthy();
      expect(user.email).toBe("find@example.com");
    });

    it("should return null for non-existent email", async () => {
      const user = await userRepository.findUserByEmail(
        "nonexistent@example.com",
      );

      expect(user).toBeNull();
    });
  });

  describe("findUserById", () => {
    it("should find user by id", async () => {
      const insertResult = await db.query(
        `INSERT INTO app.users (username, email, password_hash)
                 VALUES ($1, $2, $3) RETURNING id`,
        ["testuser", "find@example.com", "hash"],
      );

      const user = await userRepository.findUserById(insertResult.rows[0].id);

      expect(user).toBeTruthy();
      expect(user.id).toBe(insertResult.rows[0].id);
    });
    it("should return null for non-existent id", async () => {
      const user = await userRepository.findUserById(999999);

      expect(user).toBeNull();
    });
  });

  describe("findUserByName", () => {
    it("should find user by username", async () => {
      await db.query(
        `INSERT INTO app.users (username, email, password_hash)
                 VALUES ($1, $2, $3)`,
        ["testuser", "find@example.com", "hash"],
      );

      const user = await userRepository.findUserByName("testuser");

      expect(user).toBeTruthy();
      expect(user.username).toBe("testuser");
    });

    it("should return null for non-existent username", async () => {
      const user = await userRepository.findUserByName("nonexistent");

      expect(user).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return empty array", async () => {
      const users = await userRepository.findAll();
      expect(users.length).toBe(0);
    });

    it("should return all users", async () => {
      const usersData = [
        {
          username: "integration_test",
          email: "test@example.com",
          password_hash: "hashed_password",
          age: 25,
        },
        {
          username: "integration_test2",
          email: "test2@example.com",
          password_hash: "hashed_password",
          age: 20,
        },
      ];

      // Create users sequentially
      for (const userData of usersData) {
        await userRepository.createUser(userData);
      }

      const users = await userRepository.findAll();
      expect(users.length).toBe(2);
      expect(users[0].username).toBe("integration_test");
      expect(users[1].username).toBe("integration_test2");
    });
  });

  describe("updateUser", () => {
    it("should update user data", async () => {
      const insertResult = await db.query(
        `INSERT INTO app.users (username, email, password_hash)
                 VALUES ($1, $2, $3) RETURNING id`,
        ["testuser", "update@example.com", "hash"],
      );

      const updatedUser = await userRepository.updateUser(
        insertResult.rows[0].id,
        { username: "updateduser" },
      );

      expect(updatedUser).toBeTruthy();
      expect(updatedUser.username).toBe("updateduser");
    });
  });

  it("should return null when updating non-existent user", async () => {
    const updatedUser = await userRepository.updateUser(999999, {
      username: "updateduser",
    });

    expect(updatedUser).toBeNull();
  });

  describe("updateUserPassword", () => {
    it("should update user password", async () => {
      const insertResult = await db.query(
        `INSERT INTO app.users (username, email, password_hash)
                 VALUES ($1, $2, $3) RETURNING id`,
        ["testuser", "update@example.com", "hash"],
      );

      const updatedUser = await userRepository.updateUserPassword(
        insertResult.rows[0].id,
        { password: "new_hashed_password" },
      );

      expect(updatedUser).toBeTruthy();
      expect(updatedUser.passwordHash).toBe("new_hashed_password");
    });
  });

  it("should return null when updating password for non-existent user", async () => {
    const updatedUser = await userRepository.updateUserPassword(999999, {
      password: "hash",
    });

    expect(updatedUser).toBeNull();
  });

  describe("deleteUserById", () => {
    it("should delete user by id", async () => {
      const insertResult = await db.query(
        `INSERT INTO app.users (username, email, password_hash)
        VALUES($1, $2, $3) RETURNING id`,
        ["testuser", "delete@example.com", "hash"],
      );

      await userRepository.deleteUserById(insertResult.rows[0].id);

      const deletedUser = await userRepository.findUserById(
        insertResult.rows[0].id,
      );
      expect(deletedUser).toBeNull();
    });
  });
  it("should do nothing when deleting non-existent user", async () => {
    await expect(userRepository.deleteUserById(999999)).resolves.not.toThrow();
  });

  describe("activateUserById", () => {
    it("should activate user by id", async () => {
      const insertResult = await db.query(
        `INSERT INTO app.users (username, email, password_hash)
        VALUES($1, $2, $3) RETURNING id
        `,
        ["testuser", "activate@example.com", "hash"],
      );

      const activatedUser = await userRepository.activateUserById(
        insertResult.rows[0].id,
      );
      expect(activatedUser.isActive).toBe(true);
      expect(activatedUser.activatedAt).not.toBeNull();
    });
    it("should return null when activating non-existent user", async () => {
      const activatedUser = await userRepository.activateUserById(999999);
      expect(activatedUser).toBeNull();
    });
    it("should not change activated_at if user is already active", async () => {
      const insertResult = await db.query(
        `INSERT INTO app.users (username, email, password_hash, is_active, activated_at)
        VALUES($1, $2, $3, TRUE, CURRENT_TIMESTAMP) RETURNING id, activated_at
        `,
        ["testuser", "activate@example.com", "hash"],
      );

      const originalActivatedAt = insertResult.rows[0].activated_at;

      const activatedUser = await userRepository.activateUserById(
        insertResult.rows[0].id,
      );
      expect(activatedUser.isActive).toBe(true);
      expect(activatedUser.activatedAt).toEqual(originalActivatedAt);
    });
  });
});
