import {
  setupTestDatabase,
  teardownTestDatabase,
} from "../../setup/test.database.js";
import db from "../../../config/database.js";
import {
  BCRYPT_ROUNDS,
  HTTP_CONFLICT,
  HTTP_NOT_FOUND,
  HTTP_OK,
  USER_ERRORS,
  USER_MESSAGES,
} from "../../../constants";
import bcrypt from "bcrypt";

import app from "../../../index.js";
import request from "supertest";

describe("Activate User By Id E2E Flow", () => {
  let inactiveUser;
  let activeUser;
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

    // Create inactive user
    const inactiveResult = await db.query(
      `INSERT INTO app.users(username, email, password_hash, age, is_active) VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [mockData.username, mockData.email, hashedPassword, mockData.age, false],
    );
    inactiveUser = inactiveResult.rows[0];

    // Create active user
    const activeResult = await db.query(
      `INSERT INTO app.users(username, email, password_hash, age, is_active, activated_at) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [
        mockData.username + "2",
        mockData.email.replace("@", "2@"),
        hashedPassword,
        mockData.age,
        true,
        new Date(),
      ],
    );
    activeUser = activeResult.rows[0];
  });

  it("should activate user by id successfully", async () => {
    const response = await request(app).patch(
      `/users/${inactiveUser.id}/activate`,
    );

    expect(response.status).toBe(HTTP_OK);
    expect(response.body.message).toBe(USER_MESSAGES.ACTIVATED);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBe(inactiveUser.id);
    expect(response.body.data.isActive).toBe(true);
  });

  it("should return conflict when user is already activated", async () => {
    const response = await request(app).patch(
      `/users/${activeUser.id}/activate`,
    );

    expect(response.status).toBe(HTTP_CONFLICT);
    expect(response.body.message).toBe(USER_ERRORS.ALREADY_ACTIVATED);
    expect(response.body.success).toBe(false);
  });

  it("should return user not found", async () => {
    const response = await request(app).patch(`/users/9999/activate`);

    expect(response.status).toBe(HTTP_NOT_FOUND);
    expect(response.body.message).toBe(USER_ERRORS.NOT_FOUND);
    expect(response.body.success).toBe(false);
  });
});
