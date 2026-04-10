import { Pool } from "pg";

const testPool = new Pool({
  host:
    process.env.TEST_DB_CONNECTION || process.env.TEST_DB_HOST || "localhost",
  port: process.env.TEST_DB_PORT || 5432,
  database: process.env.TEST_DB_NAME || "myapp_test",
  user: process.env.TEST_DB_USERNAME || "postgres",
  password: process.env.TEST_DB_PASSWORD || "postgres",
});

async function setupTestDatabase() {
  // Run migrations
  await testPool.query(`
        CREATE SCHEMA IF NOT EXISTS app;

        CREATE TABLE IF NOT EXISTS app.users (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        activated_at TIMESTAMPTZ DEFAULT NULL,
        last_login TIMESTAMPTZ DEFAULT NULL,
        age INT CHECK(age >=13 AND age <=150)
      );

    `);

  return testPool;
}

async function teardownTestDatabase() {
  // Clean up after tests
  await testPool.query("DROP SCHEMA IF EXISTS app CASCADE");
  await testPool.end();
}

async function clearTestDatabase() {
  // Clear data between tests
  await testPool.query("TRUNCATE TABLE app.users CASCADE");
}

export { setupTestDatabase, teardownTestDatabase, clearTestDatabase, testPool };
