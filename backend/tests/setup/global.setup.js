import { Pool } from "pg";
import { exec } from "child_process";
import { promisify } from "util";
import crypto from "crypto";

const execAsync = promisify(exec);

const globalSetup = async () => {
  console.log("🌍 Global test setup starting...");

  // In Docker environment, database setup is handled by wait-for-test-db.sh
  if (process.env.DB_CONNECTION === 'postgres_test') {
    console.log("✅ Running in Docker test environment - skipping database setup");
    console.log("DB_NAME:", process.env.DB_NAME);
    global.__TEST_DB_NAME__ = process.env.DB_NAME;
    global.__TEST_START_TIME__ = Date.now();
    console.log("✅ Global test setup complete (Docker mode)");
    return;
  }

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

  // Create schema in the test database before migrations
  const testPool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  try {
    await testPool.query('CREATE SCHEMA IF NOT EXISTS app');
    console.log("✅ App schema created");
  } catch (error) {
    console.error("Failed to create app schema:", error);
    throw error;
  } finally {
    await testPool.end();
  }

  // Run migrations
  try {
    const dbUrl = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    console.log("🚀 Running migrations with DATABASE_URL:", dbUrl);
    const { stdout, stderr } = await execAsync(`DATABASE_URL="${dbUrl}" npx node-pg-migrate up`, {
      cwd: process.cwd(),
    });
    console.log("✅ Migrations completed");
    console.log("Migration stdout:", stdout);
    if (stderr) console.log("Migration stderr:", stderr);
  } catch (error) {
    console.error("❌ Failed to run migrations:", error.message);
    console.error("Error code:", error.code);
    console.error("Error stdout:", error.stdout);
    console.error("Error stderr:", error.stderr);
    throw error;
  }

  // Set global variables for tests
  global.__TEST_DB_NAME__ = process.env.DB_NAME;
  global.__TEST_START_TIME__ = Date.now();

  console.log("✅ Global test setup complete");
};

export default globalSetup;
