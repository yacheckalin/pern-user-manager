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
});
