import {
  teardownTestDatabase,
  setupTestDatabase,
} from "../../setup/test.database.js";
import db from "../../../config/database.js";
import request from "supertest";
import app from "../../../index.js";
import bcrypt from 'bcrypt';
import { API_PREFIX, API_VERSION, BCRYPT_ROUNDS, USER_ERRORS } from "../../../constants/index.js";

describe("User Get BY ID E2E Flow", () => {
  let user;
  const mockUserData = {
    username: 'username',
    email: 'user@email.com',
    isActive: true,
    age: 39
  }
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

    const hashedPassword = await bcrypt.hash('hash', BCRYPT_ROUNDS);

    const result = await db.query(`INSERT INTO app.users(username, email, password_hash, is_active, age) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *
      `, [mockUserData.username, mockUserData.email, hashedPassword, mockUserData.isActive, mockUserData.age]);
    user = result.rows[0]
  });

  it("should complete get user by id e2e flow", async () => {
    const response = await request(app).get(`${API_URL}/users/${user.id}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(user.id);
    expect(response.body.data.username).toBe(user.username);
    expect(response.body.data.email).toBe(user.email);
    expect(response.body.data.isActive).toBe(user.is_active);
    expect(response.body.data.age).toBe(user.age);
  });

  it("should return 404 when user does not exist", async () => {
    const response = await request(app).get(`${API_URL}/users/9999`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(USER_ERRORS.NOT_FOUND);
    expect(response.body.data).toBeUndefined();
  });
});
