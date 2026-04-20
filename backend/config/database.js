import { Pool } from "pg";
import { DB_ERRORS } from "../constants/index.js";
import 'dotenv/config';
import logger from '../logger.js';
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

    this.ended = false;
    this.initializeDatabase();

    this.pool.on('connect', async (client) => {
      client.query('SET search_path TO app, public');

    });
  }

  async initializeDatabase() {
    this.pool.on('connect', async (client) => {
      try {
        await client.query(`CREATE SCHEMA IF NOT EXISTS ${process.env.SCHEMA}`)

      } catch (error) {
        logger.error('Error setting up database connection: ', error)
      }
    })
  }

  async query(text, params) {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;

      // log slow queries
      if (duration > 100) {
        logger.info(`Slow query (${duration}ms):`, text);
      }
      return result;
    } catch (error) {
      logger.error(DB_ERRORS.DB_QUERY_FAILED, error);
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
    if (this.ended) {
      return;
    }

    await this.pool.end();
    this.ended = true;
  }
}

export default new Database();
