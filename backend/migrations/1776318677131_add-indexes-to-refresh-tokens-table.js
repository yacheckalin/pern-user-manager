/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql(`
     
      CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
      CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
      CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
    `)
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    DROP INDEX IF EXISTS idx_refresh_tokens_user_id
    `)
  pgm.sql(`
    DROP INDEX IF EXISTS idx_refresh_tokens_token_hash
    `)
  pgm.sql(`
    DROP INDEX IF EXISTS idx_refresh_tokens_expires_at
    `)
};
