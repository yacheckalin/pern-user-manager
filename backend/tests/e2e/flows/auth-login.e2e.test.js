import {
  teardownTestDatabase,
  setupTestDatabase,
} from "../../setup/test.database.js";
import db from "../../../config/database.js";
import request from "supertest";
import app from "../../../index.js";
import bcrypt from "bcrypt";
import { AUTH_ERRORS, BCRYPT_ROUNDS, HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED, USER_MESSAGES } from "../../../constants/index.js";

describe("User Login E2E Flow", () => {
  const mockUserData = {
    username: 'username',
    email: "valid@email.com",
    password: "password_hash",
    age: 33
  }
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
    const passwordHash = await bcrypt.hash(mockUserData.password, BCRYPT_ROUNDS);
    await db.query(`
      INSERT INTO app.users (username, email, password_hash, age) 
      VALUES ($1, $2, $3, $4)`,
      [mockUserData.username, mockUserData.email, passwordHash, mockUserData.age]);
  });

  it("should login an existing user via [username] successfully", async () => {


    const response = await request(app).post("/auth/login").send({ username: 'username', password: 'password_hash' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.username).toBe(mockUserData.username);
    expect(response.body.data.email).toBe(mockUserData.email);
    expect(response.body.data.age).toBe(mockUserData.age);
    expect(response.body.data.isActive).toBe(false);
    expect(response.body.data.lastLogin).toBeDefined();
  });

  it('should login an existing user via [email] successfully', async () => {
    const response = await request(app).post("/auth/login").send({ username: "valid@email.com", password: 'password_hash' })
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(USER_MESSAGES.AUTHORIZED);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.lastLogin).toBeDefined();
    expect(response.body.data.email).toBe(mockUserData.email)
  })

  it(`should throw ${AUTH_ERRORS.INVALID_CRIDENTIALS} `, async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: "other@email.com", password: "password" });

    expect(res.status).toBe(HTTP_UNAUTHORIZED);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(AUTH_ERRORS.INVALID_CRIDENTIALS)

  });

  it(`should throw ${AUTH_ERRORS.INVALID_EMAIL}`, async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: "other@e", password: "password" });

    expect(res.status).toBe(HTTP_BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(AUTH_ERRORS.INVALID_EMAIL)
  })
  it(`should throw ${AUTH_ERRORS.INVALID_USERNAME}`, async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: "ot", password: "password" });

    expect(res.status).toBe(HTTP_BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(AUTH_ERRORS.INVALID_USERNAME)
  });
  it(`should throw ${AUTH_ERRORS.INVALID_PASSWORD}`, async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: "username", password: "pass" });

    expect(res.status).toBe(HTTP_BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(AUTH_ERRORS.INVALID_PASSWORD)
  });
  it(`should throw ${AUTH_ERRORS.INVALID_PASSWORD}`, async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: "username", password: `
        00000000000
        11111111111
        22222222222
        33333333333
        44444444444
        55555555555` });

    expect(res.status).toBe(HTTP_BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(AUTH_ERRORS.INVALID_PASSWORD)
  });
  it(`should throw ${AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL}`, async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: "", password: `password_hash` });

    expect(res.status).toBe(HTTP_BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL)
  });
});