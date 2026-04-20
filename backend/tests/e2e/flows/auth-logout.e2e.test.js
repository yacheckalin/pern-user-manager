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
  HTTP_FORBIDDEN,
  HTTP_OK,
  HTTP_UNAUTHORIZED,
  TOKEN_MESSAGES,
  USER_MESSAGES,
} from "../../../constants/index.js";

import jwt from 'jsonwebtoken';
import 'dotenv/config'

describe("Auth Refresh E2E Flow", () => {
  const mockUserData = {
    username: 'username',
    email: "valid@email.com",
    password: "password_hash",
    age: 39
  }
  const API_URL = API_PREFIX + '/' + API_VERSION;
  let accessToken = null;
  let refreshToken = null;

  const agent = request.agent(app);

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

      const response = await agent
        .post(`${API_URL}/auth/login`)
        .send({
          username: mockUserData.username,
          password: mockUserData.password
        });
      accessToken = response.body.data.accessToken;


      const cookies = response.header['set-cookie'];
      const refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));

      refreshToken = refreshTokenCookie.split(';')[0].split('=')[1];

    } catch (error) {
      console.error('Fail to clear [USER LOGIN E2E FLOW SUITE CASE]', error.message)
    }
  });

  it('should logout successfully [with valid refresh token]', async () => {
    const response = await agent
      .post(`${API_URL}/auth/logout`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HTTP_OK);
    expect(response.body.message).toBe(USER_MESSAGES.LOGOUT);
    expect(response.body.success).toBe(true);
  });

  it('should refresh token successfully [with valid refresh token]', async () => {
    const response = await agent.post(`${API_URL}/auth/refresh`);

    expect(response.status).toBe(HTTP_OK);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(TOKEN_MESSAGES.ROTATED);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.accessToken).toBeDefined();

    const responseCookies = response.header['set-cookie'];
    expect(Array.isArray(responseCookies)).toBe(true);
    expect(responseCookies.some((cookie) => cookie.startsWith('refreshToken='))).toBe(true);
    expect(responseCookies.some((cookie) => cookie.startsWith('accessToken='))).toBe(true);
  });

  it(`should return ${AUTH_ERRORS.UNAUTHORIZED_ACCESS} when refresh token is missing`, async () => {
    const anonymousAgent = request.agent(app);
    const response = await anonymousAgent.post(`${API_URL}/auth/refresh`);

    expect(response.status).toBe(HTTP_FORBIDDEN);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(AUTH_ERRORS.UNAUTHORIZED_ACCESS);
  });

});