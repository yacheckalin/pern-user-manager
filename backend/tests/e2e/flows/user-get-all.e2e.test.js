import {
  teardownTestDatabase,
  setupTestDatabase,
} from "../../setup/test.database.js";
import db from "../../../config/database.js";
import request from "supertest";
import app from "../../../index.js";
import { API_PREFIX, API_VERSION, AUTH_ERRORS, BCRYPT_ROUNDS, HTTP_UNAUTHORIZED } from "../../../constants/index.js";
import bcrypt from 'bcrypt'

describe("User Get All E2E Flow", () => {
  const mockUserData = {
    username: "username",
    password: "password",
    email: 'test@test.test',
    age: 22
  }
  let accessToken = null;
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


    const query = "INSERT INTO app.users(username, email, password_hash, age) VALUES ($1, $2, $3, $4)";
    const hashedPassword = await bcrypt.hash(mockUserData.password, BCRYPT_ROUNDS);
    await db.query(query, [mockUserData.username, mockUserData.email, hashedPassword, mockUserData.age]);

    const result = await request(app).post(`${API_URL}/auth/login`)
      .send({ username: mockUserData.username, password: mockUserData.password });

    accessToken = result.body.data.accessToken;
  });

  it("should complete get all users e2e flow", async () => {


    const allUsers = await request(app)
      .get(`${API_URL}/users`)
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Accept', 'application/json');

    expect(allUsers.status).toBe(200);
    expect(allUsers.body.success).toBe(true);
  });

  it("should return empty array when no users exist", async () => {
    const allUsers = await request(app)
      .get(`${API_URL}/users`)
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Accept', 'application/json');

    expect(allUsers.status).toBe(200);
    expect(allUsers.body.success).toBe(true);
    expect(Array.isArray(allUsers.body.data)).toBe(true);
    expect(allUsers.body.data.length).toBe(1); // registered user (only one)
  });

  it(`shold return ${AUTH_ERRORS.HTTP_UNAUTHORIZED}`, async () => {
    const users = await request(app).get(`${API_URL}/users`);

    //TODO: Uncomment this after UI will be ready
    // expect(users.status).toBe(HTTP_UNAUTHORIZED);
    expect(users.body.success).toBe(false);

  })
});
