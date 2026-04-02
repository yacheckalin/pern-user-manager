const { Pool } = require("pg");

class Database {
  constructor() {
    const {
      DB_CONNECTION,
      DB_PORT,
      DB_NAME,
      DB_USERNAME,
      DB_PASSWORD,
      DB_MAX_CLIENTS,
      DB_IDLE_TIMEOUT,
      DB_CONNECTION_TIMEOUT,
    } = process.env;

    this.pool = new Pool({
      host: DB_CONNECTION,
      port: DB_PORT,
      database: DB_NAME,
      user: DB_USERNAME,
      password: DB_PASSWORD,
      max: DB_MAX_CLIENTS,
      idleTimeoutMillis: DB_IDLE_TIMEOUT,
      connectionTimeoutMillis: DB_CONNECTION_TIMEOUT,
    });

    // set search path to use 'app' schema
    this.pool.on("connect", (client) => {
      client.query("SET search_path to app,public");
    });
  }

  async query(text, params) {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;

      // log slow queries
      if (duration > 100) {
        console.log(`Slow query (${duration}ms):`, text);
      }
      return result;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  }

  async getClient() {
    return await this.pool.connect();
  }

  async transaction(callback) {
    const client = await this.getClient();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async end() {
    await this.pool.end();
  }
}

module.exports = new Database();
