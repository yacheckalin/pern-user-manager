import {
  setupTestDatabase,
  teardownTestDatabase,
} from "../../setup/test.database.js";
import db from "../../../config/database.js";
import {
  BCRYPT_ROUNDS,
  HTTP_NOT_FOUND,
  HTTP_OK,
  USER_ERRORS,
  USER_MESSAGES,
} from "../../../constants";
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
    const response = await request(app).delete(`/users/${user.id}`);

    expect(response.status).toBe(HTTP_OK);
    expect(response.body.message).toBe(USER_MESSAGES.DELETED);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBe(user.id);
  });

  it("should return user not found", async () => {
    const response = await request(app).delete(`/users/9999`);

    expect(response.status).toBe(HTTP_NOT_FOUND);
    expect(response.body.message).toBe(USER_ERRORS.NOT_FOUND);
    expect(response.body.success).toBe(false);
  });
});
