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
    ALTER TABLE app.refresh_tokens DROP CONSTRAINT IF EXISTS fk_replaced_by_token_id;

    ALTER TABLE app.refresh_tokens
      ADD CONSTRAINT fk_replaced_by_token_id FOREIGN KEY (replaced_by_token_id) 
      REFERENCES app.refresh_tokens(id) ON DELETE SET NULL
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    ALTER TABLE app.refresh_tokens DROP CONSTRAINT IF EXISTS fk_replaced_by_token_id
  `);
};
