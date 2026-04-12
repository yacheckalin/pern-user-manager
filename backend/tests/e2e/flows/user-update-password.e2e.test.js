import {
  teardownTestDatabase,
  setupTestDatabase,
} from "../../setup/test.database.js";
import db from "../../../config/database.js";
import request from "supertest";
import app from "../../../index.js";
import {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_OK,
  USER_ERRORS,
  USER_MESSAGES,
} from "../../../constants/index.js";
import bcrypt from "bcrypt";

describe("User Update Password E2E Flow", () => {
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
    // Clean up before each test
    await db.query("TRUNCATE TABLE app.users CASCADE");

    const hashedPassword = await bcrypt.hash(originalPassword, 10);

    const result = await db.query(
      `INSERT INTO app.users(username, email, password_hash, age) VALUES($1, $2, $3, $4) RETURNING *`,
      [mockData.username, mockData.email, hashedPassword, mockData.age],
    );
    user = result.rows[0];
  });
  it("should update user password correctly", async () => {
    const data = {
      old_password: originalPassword,
      new_password: "newpassword123",
      confirm_password: "newpassword123",
    };

    const response = await request(app)
      .patch(`/users/${user.id}/password`)
      .send(data);

    expect(response.status).toBe(HTTP_OK);
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBe(USER_MESSAGES.PASSWORD_CHANGED);
    expect(response.body.data.id).toBe(user.id);
    // expect(response.body.data.updatedAt).toBe(user.updated_at); // Skip timestamp comparison
  });

  it("should return not found", async () => {
    const data = {
      old_password: originalPassword,
      new_password: "newpassword123",
      confirm_password: "newpassword123",
    };

    const response = await request(app)
      .patch(`/users/9999/password`)
      .send(data);

    expect(response.status).toBe(HTTP_NOT_FOUND);
    expect(response.body.message).toBe(USER_ERRORS.NOT_FOUND);
    expect(response.body.success).toBe(false);
  });

  it("should return validation error for invalid old password", async () => {
    const data = {
      old_password: "wrongpassword",
      new_password: "newpassword123",
      confirm_password: "newpassword123",
    };

    const response = await request(app)
      .patch(`/users/${user.id}/password`)
      .send(data);

    expect(response.status).toBe(HTTP_BAD_REQUEST);
    expect(response.body.message).toBe(USER_ERRORS.OLD_PASSWORD_INVALID);
    expect(response.body.success).toBe(false);
  });

  it("should return validation error for new password too short", async () => {
    const data = {
      old_password: originalPassword,
      new_password: "short",
      confirm_password: "short",
    };

    const response = await request(app)
      .patch(`/users/${user.id}/password`)
      .send(data);

    expect(response.status).toBe(HTTP_BAD_REQUEST);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe(
      "Password must be at least 6 characters long",
    );
  });

  it("should return validation error for confirm password mismatch", async () => {
    const data = {
      old_password: originalPassword,
      new_password: "newpassword123",
      confirm_password: "differentpassword",
    };

    const response = await request(app)
      .patch(`/users/${user.id}/password`)
      .send(data);

    expect(response.status).toBe(HTTP_BAD_REQUEST);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Password do not match");
  });

  it("should return validation error for new password same as old", async () => {
    const data = {
      old_password: originalPassword,
      new_password: originalPassword,
      confirm_password: originalPassword,
    };

    const response = await request(app)
      .patch(`/users/${user.id}/password`)
      .send(data);

    expect(response.status).toBe(HTTP_BAD_REQUEST);
    expect(response.body.message).toBe(USER_ERRORS.NEW_PASSWORD_THE_SAME);
    expect(response.body.success).toBe(false);
  });
});
