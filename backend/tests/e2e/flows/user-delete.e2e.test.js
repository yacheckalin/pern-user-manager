import {
  setupTestDatabase,
  teardownTestDatabase,
} from "../../setup/test.database.js";
import db from "../../../config/database.js";
import {
  API_PREFIX,
  API_VERSION,
  BCRYPT_ROUNDS,
  HTTP_NO_CONTENT,
  HTTP_NOT_FOUND,
  HTTP_OK,
  USER_ERRORS,
  USER_MESSAGES,
} from "../../../constants/index.js";
import bcrypt from "bcrypt";

import app from "../../../index.js";
import request from "supertest";

describe("Delete User By Id E2E Flow", () => {
  let user;
  let originalPassword = "password123";
  let mockData = {
    username: "username",
    email: "email@email.com",
    password: originalPassword,
    age: 25,
  };

  const API_URL = API_PREFIX + '/' + API_VERSION;

  beforeAll(async () => {
    await setupTestDatabase();
  });
  afterAll(async () => {
    await teardownTestDatabase();
    await db.end();
  });
  beforeEach(async () => {
    await db.query("TRUNCATE TABLE app.users CASCADE");

    const hashedPassword = await bcrypt.hash(originalPassword, BCRYPT_ROUNDS);
    const result = await db.query(
      `INSERT INTO app.users(username, email, password_hash, age) VALUES($1,$2,$3,$4) RETURNING *`,
      [mockData.username, mockData.email, hashedPassword, mockData.age],
    );

    user = result.rows[0];
  });

  it("should delete user by id successfully", async () => {
    const response = await request(app).delete(`${API_URL}/users/${user.id}`);
    expect(response.status).toBe(HTTP_NO_CONTENT);
  });

  it("should return user not found", async () => {
    const response = await request(app).delete(`${API_URL}/users/9999`);

    expect(response.status).toBe(HTTP_NOT_FOUND);
    expect(response.body.message).toBe(USER_ERRORS.NOT_FOUND);
    expect(response.body.success).toBe(false);
  });
});
