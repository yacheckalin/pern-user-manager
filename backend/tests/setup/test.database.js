import { Pool } from "pg";
import dotenv from 'dotenv';
import logger from '../../logger.js';

dotenv.config();

const dbConfig = process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {
  host: process.env.DB_HOST || process.env.DB_CONNECTION || "localhost",
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || "myapp_test",
  user: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
}
const testPool = new Pool(dbConfig);

async function setupTestDatabase() {
  const schema = process.env.SCHEMA || 'app';

  await testPool.query('SELECT 1');
  await testPool.query(`SET search_path TO ${schema}, public`);

  return testPool;
}

async function teardownTestDatabase() {
  // Clean up after tests
  if (testPool) {
    await testPool.end();
  }
}

async function clearTestDatabase() {
  try {
    const schema = process.env.SCHEMA || 'app';
    // Clear data between tests
    await testPool.query(`TRUNCATE TABLE ${schema}.users, ${schema}.refresh_tokens RESTART IDENTITY CASCADE`);

  } catch (error) {
    logger.error(`Fail to clear test database [${error.message}]`)
    throw new Error(error);
  }
}

export { setupTestDatabase, teardownTestDatabase, clearTestDatabase, testPool };
