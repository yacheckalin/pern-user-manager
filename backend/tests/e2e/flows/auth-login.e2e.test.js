import {
  teardownTestDatabase,
  setupTestDatabase,
} from "../../setup/test.database.js";
import db from "../../../config/database.js";
import request from "supertest";
import app from "../../../index.js";
import bcrypt from "bcrypt";
import {
  API_PREFIX,
  API_VERSION,
  AUTH_ERRORS,
  BCRYPT_ROUNDS,
  HTTP_BAD_REQUEST,
  HTTP_OK,
  HTTP_UNAUTHORIZED,
  USER_MESSAGES
} from "../../../constants/index.js";

import jwt from 'jsonwebtoken';
import 'dotenv/config'

describe("User Login E2E Flow", () => {
  const mockUserData = {
    username: 'username',
    email: "valid@email.com",
    password: "password_hash",
    age: 33
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
    try {
      const schema = process.env.SCHEMA || 'app';

      await db.query(`TRUNCATE TABLE ${schema}.users, ${schema}.refresh_tokens RESTART IDENTITY CASCADE`)
      const passwordHash = await bcrypt.hash(mockUserData.password, BCRYPT_ROUNDS);
      await db.query(`
        INSERT INTO ${process.env.SCHEMA || 'app'}.users (username, email, password_hash, age) 
        VALUES ($1, $2, $3, $4)`,
        [mockUserData.username, mockUserData.email, passwordHash, mockUserData.age]);
    } catch (error) {
      console.error('Fail to clear [USER LOGIN E2E FLOW SUITE CASE]', error.message)
    }
  });

  it("should login an existing user via [username] successfully", async () => {


    const response = await request(app).post(`${API_URL}/auth/login`).send({ username: 'username', password: 'password_hash' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.message).toBe(USER_MESSAGES.AUTHORIZED)

    jwt.verify(response.body.data.accessToken, process.env.JWT_ACCESS_TOKEN_SECRET, (err, item) => {
      if (err) {
        console.error(err)
      }
      expect(item.auth.id).toBeDefined();
      expect(item.auth.username).toBe(mockUserData.username);
      expect(item.auth.email).toBe(mockUserData.email);
      expect(item.auth.age).toBe(mockUserData.age);
      expect(item.auth.isActive).toBe(false)
      expect(item.auth.lastLogin).toBeDefined();

    });

  });

  it('should login an existing user via [email] successfully', async () => {
    const response = await request(app).post(`${API_URL}/auth/login`).send({ username: "valid@email.com", password: 'password_hash' })
    expect(response.status).toBe(HTTP_OK);
    expect(response.body.success).toBe(true)

    expect(response.body.message).toBe(USER_MESSAGES.AUTHORIZED);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.accessToken).toBeDefined();


    jwt.verify(response.body.data.accessToken, process.env.JWT_ACCESS_TOKEN_SECRET, (err, item) => {
      if (err) {
        console.error(err)
      }
      expect(item.auth.id).toBeDefined();
      expect(item.auth.username).toBe(mockUserData.username);
      expect(item.auth.email).toBe(mockUserData.email);
      expect(item.auth.age).toBe(mockUserData.age);
      expect(item.auth.isActive).toBe(false)
      expect(item.auth.lastLogin).toBeDefined();

    });
  })

  it(`should throw ${AUTH_ERRORS.INVALID_CRIDENTIALS} `, async () => {
    const res = await request(app)
      .post(`${API_URL}/auth/login`)
      .send({ username: "other@email.com", password: "password" });

    expect(res.status).toBe(HTTP_UNAUTHORIZED);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(AUTH_ERRORS.INVALID_CRIDENTIALS)

  });

  it(`should throw ${AUTH_ERRORS.INVALID_EMAIL}`, async () => {
    const res = await request(app)
      .post(`${API_URL}/auth/login`)
      .send({ username: "other@e", password: "password" });

    expect(res.status).toBe(HTTP_BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(AUTH_ERRORS.INVALID_EMAIL)
  })
  it(`should throw ${AUTH_ERRORS.INVALID_USERNAME}`, async () => {
    const res = await request(app)
      .post(`${API_URL}/auth/login`)
      .send({ username: "ot", password: "password" });

    expect(res.status).toBe(HTTP_BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(AUTH_ERRORS.INVALID_USERNAME)
  });
  it(`should throw ${AUTH_ERRORS.INVALID_PASSWORD}`, async () => {
    const res = await request(app)
      .post(`${API_URL}/auth/login`)
      .send({ username: "username", password: "pass" });

    expect(res.status).toBe(HTTP_BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(AUTH_ERRORS.INVALID_PASSWORD)
  });
  it(`should throw ${AUTH_ERRORS.INVALID_PASSWORD}`, async () => {
    const res = await request(app)
      .post(`${API_URL}/auth/login`)
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
      .post(`${API_URL}/auth/login`)
      .send({ username: "", password: `password_hash` });

    expect(res.status).toBe(HTTP_BAD_REQUEST);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(AUTH_ERRORS.INVALID_USERNAME_OR_EMAIL)
  });
});