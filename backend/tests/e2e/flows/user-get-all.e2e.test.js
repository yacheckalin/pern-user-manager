import {
  teardownTestDatabase,
  setupTestDatabase,
} from "../../setup/test.database.js";
import db from "../../../config/database.js";
import request from "supertest";
import app from "../../../index.js";

describe("User Get All E2E Flow", () => {
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

  it("should complete get all users e2e flow", async () => {
    const allUsers = await request(app).get("/users");

    expect(allUsers.status).toBe(200);
    expect(allUsers.body.success).toBe(true);
  });

  it("should return empty array when no users exist", async () => {
    const allUsers = await request(app).get("/users");

    expect(allUsers.status).toBe(200);
    expect(allUsers.body.success).toBe(true);
    expect(Array.isArray(allUsers.body.data)).toBe(true);
    expect(allUsers.body.data.length).toBe(0);
  });
});
