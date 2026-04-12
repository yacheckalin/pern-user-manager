import { Pool } from "pg";
import { exec } from "child_process";
import { promisify } from "util";
import crypto from "crypto";

const execAsync = promisify(exec);

const globalSetup = async () => {
  console.log("🌍 Global test setup starting...");

  // Set test environment
  process.env.NODE_ENV = "test";
  process.env.DB_NAME = `test_${crypto.randomBytes(8).toString("hex")}`;
  process.env.DB_HOST = process.env.DB_HOST || "localhost";
  process.env.DB_PORT = process.env.DB_PORT || "5432";
  process.env.DB_USER = process.env.DB_USERNAME || "postgres";
  process.env.DB_PASSWORD = process.env.DB_PASSWORD || "postgres";

  // Create test database
  const adminPool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: "postgres",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  try {
    await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log(`✅ Test database created: ${process.env.DB_NAME}`);
  } catch (error) {
    console.error("Failed to create test database:", error);
    throw error;
  } finally {
    await adminPool.end();
  }

  // Run migrations
  try {
    await execAsync(`npm run migrate:up -- --database ${process.env.DB_NAME}`);
    console.log("✅ Migrations completed");
  } catch (error) {
    console.error("Failed to run migrations:", error);
    throw error;
  }

  // Set global variables for tests
  global.__TEST_DB_NAME__ = process.env.DB_NAME;
  global.__TEST_START_TIME__ = Date.now();

  console.log("✅ Global test setup complete");
};

export default globalSetup;
