import {
  teardownTestDatabase,
  setupTestDatabase,
} from "../../setup/test.database";
import db from "../../../config/database.js";
import request from "supertest";
import app from "../../../index.js";

describe("User Create E2E Flow", () => {
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
  });

  it("should create a new user successfully", async () => {
    const userData = {
      username: "newuser",
      email: "newuser@example.com",
      password: "secure_password_123",
      age: 25,
    };

    const response = await request(app).post("/users").send(userData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.username).toBe(userData.username);
    expect(response.body.data.email).toBe(userData.email);
    expect(response.body.data.age).toBe(userData.age);
    expect(response.body.data.isActive).toBe(false);
  });

  it("should return error when username is missing", async () => {
    const userData = {
      email: "test@example.com",
      password: "secure_password_123",
      age: 25,
    };

    const response = await request(app).post("/users").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error || response.body.message).toBeDefined();
  });

  it("should return error when email is missing", async () => {
    const userData = {
      username: "testuser",
      password: "secure_password_123",
      age: 25,
    };

    const response = await request(app).post("/users").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
  });

  it("should return error when password is missing", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      age: 25,
    };

    const response = await request(app).post("/users").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
  });

  it("should return error when username is too short", async () => {
    const userData = {
      username: "ab",
      email: "test@example.com",
      password: "secure_password_123",
      age: 25,
    };

    const response = await request(app).post("/users").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
  });

  it("should return error when email is invalid", async () => {
    const userData = {
      username: "testuser",
      email: "invalidemail",
      password: "secure_password_123",
      age: 25,
    };

    const response = await request(app).post("/users").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
  });

  it("should return error when password is too short", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "short",
      age: 25,
    };

    const response = await request(app).post("/users").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
  });

  it("should return error when age is too young", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "secure_password_123",
      age: 12,
    };

    const response = await request(app).post("/users").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
  });

  it("should return error when email already exists", async () => {
    const userData = {
      username: "firstuser",
      email: "duplicate@example.com",
      password: "secure_password_123",
      age: 25,
    };

    // Create first user
    await request(app).post("/users").send(userData);

    // Try to create another user with same email
    const secondUserData = {
      username: "seconduser",
      email: "duplicate@example.com",
      password: "secure_password_123",
      age: 30,
    };

    const response = await request(app).post("/users").send(secondUserData);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error || response.body.message).toBeDefined();
  });

  it("should return error when username already exists", async () => {
    const userData = {
      username: "duplicateuser",
      email: "first@example.com",
      password: "secure_password_123",
      age: 25,
    };

    // Create first user
    await request(app).post("/users").send(userData);

    // Try to create another user with same username
    const secondUserData = {
      username: "duplicateuser",
      email: "second@example.com",
      password: "secure_password_123",
      age: 30,
    };

    const response = await request(app).post("/users").send(secondUserData);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error || response.body.message).toBeDefined();
  });
});
