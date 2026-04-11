import { Pool } from "pg";
import { DB_ERRORS } from "../constants/index.js";

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
      options: "-c search_path=app,public",
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
      console.error(DB_ERRORS.DB_QUERY_FAILED, error);
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

export default new Database();
