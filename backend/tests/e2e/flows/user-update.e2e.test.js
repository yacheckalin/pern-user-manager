import {
  teardownTestDatabase,
  setupTestDatabase,
} from "../../setup/test.database.js";
import db from "../../../config/database.js";
import request from "supertest";
import app from "../../../index.js";
import {
  API_PREFIX,
  API_VERSION,
  HTTP_BAD_REQUEST,
  HTTP_CONFLICT,
  HTTP_NOT_FOUND,
  HTTP_OK,
  USER_ERRORS,
  USER_MESSAGES,
} from "../../../constants/index.js";

describe("User Update E2E Flow", () => {
  let user;
  let mockData = {
    username: "username",
    email: "email@email.com",
    password: "hash",
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
    // Clean up before each test
    await db.query("TRUNCATE TABLE app.users CASCADE");
    await db.query("TRUNCATE TABLE app.refresh_tokens CASCADE");

    const result = await db.query(
      `INSERT INTO app.users(username, email, password_hash, age) VALUES($1, $2, $3, $4) RETURNING *`,
      [mockData.username, mockData.email, mockData.password, mockData.age],
    );
    user = result.rows[0];
  });

  it("should update user by ID correctly", async () => {
    expect(user.id).toBeDefined();

    const updatedData = {
      username: "newUsername2",
      age: 30,
    };

    const result = await request(app)
      .put(`${API_URL}/users/${user.id}`)
      .send(updatedData);

    expect(result.body.success).toBe(true);
    expect(result.status).toBe(HTTP_OK);
    expect(result.body.data.updatedAt).toBeDefined();
    expect(result.body.data.username).toBe("newUsername2");
    expect(result.body.data.age).toBe(30);
    expect(result.body.data.email).toBe(mockData.email);
    expect(result.body.message).toBe(USER_MESSAGES.UPDATED);
  });
  it("should handle conflict errors (duplicate username/email)", async () => {
    const data = {
      username: "secondUser",
      email: "second@email.com",
      password: "hash",
      age: 30,
    };
    const newUser = await db.query(
      `INSERT INTO app.users(username, email, password_hash, age) VALUES($1, $2, $3, $4) RETURNING *`,
      [data.username, data.email, data.password, data.age],
    );

    expect(newUser.rows[0].id).toBeDefined();
    expect(newUser.rows[0].username).toBe(data.username);
    expect(newUser.rows[0].email).toBe(data.email);

    const response = await request(app)
      .put(`${API_URL}/users/${user.id}`)
      .send({ username: data.username });

    expect(response.status).toBe(HTTP_CONFLICT);
    expect(response.body.message).toBe(USER_ERRORS.USERNAME_TAKEN);
    expect(response.body.success).toBe(false);
  });

  it("should handle validation errors (invalid username)", async () => {
    const response = await request(app)
      .put(`${API_URL}/users/${user.id}`)
      .send({ username: "ne" });

    expect(response.status).toBe(HTTP_BAD_REQUEST);
    expect(response.body.message).toBe(USER_ERRORS.INVALID_USERNAME);
    expect(response.body.success).toBe(false);
  });
  it("should handle validation errors (invalid email)", async () => {
    const response = await request(app)
      .put(`${API_URL}/users/${user.id}`)
      .send({ email: "invalidemail" });

    expect(response.status).toBe(HTTP_BAD_REQUEST);
    expect(response.body.message).toBe(USER_ERRORS.INVALID_EMAIL);
    expect(response.body.success).toBe(false);
  });
  it("should handle validation errors (invalid age < 13)", async () => {
    const response = await request(app)
      .put(`${API_URL}/users/${user.id}`)
      .send({ age: 12 });

    expect(response.status).toBe(HTTP_BAD_REQUEST);
    expect(response.body.message).toBe(USER_ERRORS.INVALID_AGE);
    expect(response.body.success).toBe(false);
  });
  it("should handle validation errors (invalid age > 150)", async () => {
    const response = await request(app)
      .put(`${API_URL}/users/${user.id}`)
      .send({ age: 151 });

    expect(response.status).toBe(HTTP_BAD_REQUEST);
    expect(response.body.message).toBe(USER_ERRORS.INVALID_AGE);
    expect(response.body.success).toBe(false);
  });

  it("should handle user not found", async () => {
    const response = await request(app)
      .put(`${API_URL}/users/9999`)
      .send({ username: "bestUserName" });

    expect(response.status).toBe(HTTP_NOT_FOUND);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(USER_ERRORS.NOT_FOUND);
  });
});
