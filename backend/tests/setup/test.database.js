import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();

const testPool = new Pool({
  host: process.env.DB_CONNECTION || process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || "myapp_test",
  user: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

async function setupTestDatabase() {
  // Global setup (globalSetup in jest config) already creates all tables via migrations
  // This function just ensures a clean state by truncating data
  // Tables are created by global setup, so we don't recreate them here
  await testPool.query(`CREATE SCHEMA IF NOT EXISTS ${process.env.SCHEMA || 'app'}`);

  return testPool;
}

async function teardownTestDatabase() {
  // Clean up after tests
  if (testPool) {
    await testPool.end();
  }
}

async function clearTestDatabase() {
  // Clear data between tests
  await testPool.query("TRUNCATE TABLE  IF EXISTS app.users CASCADE");
}

export { setupTestDatabase, teardownTestDatabase, clearTestDatabase, testPool };
