import db from "../../../config/database.js";
import AuthRepository from "../../../repositories/auth.repo.js";

import {
  setupTestDatabase,
  teardownTestDatabase,
} from "../../setup/test.database.js";

describe("AuthRepository - Integration Tests", () => {
  let authRepository;

  beforeAll(async () => {
    await setupTestDatabase();
    authRepository = new AuthRepository(db);

  });

  afterAll(async () => {
    await teardownTestDatabase();
    await db.end();
  });

  beforeEach(async () => {
    // Clean up before each test
    await db.query("TRUNCATE TABLE app.users CASCADE");
  });

  describe("updateLastLogin", () => {
    it("should update a user in database", async () => {
      const userData = {
        username: "integration_test",
        email: "test@example.com",
        password_hash: "hashed_password",
        age: 25,
      };

      const insertResult = await db.query(
        `INSERT INTO app.users (username, email, password_hash)
                       VALUES ($1, $2, $3) RETURNING id`,
        [userData.username, userData.email, userData.password_hash],
      );
      const id = insertResult.rows[0].id;

      const result = await authRepository.updateLastLogin(id);

      expect(result).toHaveProperty("id");
      expect(result.username).toBe(userData.username);
      expect(result.email).toBe(userData.email);
      expect(result.lastLogin).toBeDefined();

      // Verify in database
      const dbResult = await db.query("SELECT * FROM app.users WHERE id = $1", [
        result.id,
      ]);
      expect(dbResult.rows[0]).toBeTruthy();
    });

    it('should return null when user not found', async () => {
      const result = await authRepository.updateLastLogin(999999);

      expect(result).toBeNull();
    });
  })
})