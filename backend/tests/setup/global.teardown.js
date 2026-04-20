import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const globalTeardown = async () => {
  console.log("🧹 Global test teardown...");

  const dbName = global.__TEST_DB_NAME__ || process.env.DB_NAME;

  if (!dbName) {
    console.warn("No test database name found");
    return;
  }

  const adminPool = new Pool({
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT,
    database: "postgres",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  try {
    // Terminate all connections to the test database
    // await adminPool.query(
    //   `
    //         SELECT pg_terminate_backend(pg_stat_activity.pid)
    //         FROM pg_stat_activity
    //         WHERE pg_stat_activity.datname = $1
    //         AND pid <> pg_backend_pid()
    //     `,
    //   [dbName],
    // );

    // Drop the test database (will be dropped when container remove)
    // await adminPool.query(`DROP DATABASE IF EXISTS ${dbName}`);
    // console.log(`✅ Test database dropped: ${dbName}`);

    console.log(`✅ Test database SKIPPED: ${dbName}`);
  } catch (error) {
    console.error("Failed to drop test database:", error);
  } finally {
    await adminPool.end();
  }

  const duration = Date.now() - global.__TEST_START_TIME__;
  console.log(`✅ Global test teardown complete (${duration}ms)`);
};

export default globalTeardown;
