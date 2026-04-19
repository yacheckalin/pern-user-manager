#!/bin/sh
# scripts/wait-for-test-db.sh

set -e

host="${DB_HOST:-${DB_CONNECTION}}"
port="${DB_PORT}"
user="${DB_USER:-${DB_USERNAME}}"
password="${DB_PASSWORD}"
db="${DB_NAME}"

echo "Waiting for test database at $host:$port..."

until PGPASSWORD=$password psql -h "$host" -p "$port" -U "$user" -d "$db" -c '\q' 2>/dev/null; do
  >&2 echo "Test database is unavailable - sleeping"
  sleep 1
done

echo "Test database is ready!"

# Create app schema if it doesn't exist
echo "Creating app schema..."
PGPASSWORD=$password psql -h "$host" -p "$port" -U "$user" -d "$db" -c "CREATE SCHEMA IF NOT EXISTS app;"

# Run migrations - set environment variables explicitly
echo "Running migrations..."
export DATABASE_URL="postgres://${user}:${password}@${host}:${port}/${db}"
export DB_CONNECTION="${host}"
export DB_PORT="${port}"
export DB_USERNAME="${user}"
export DB_PASSWORD="${password}"
export DB_NAME="${db}"
export SCHEMA="app"
node_modules/.bin/node-pg-migrate up --schema app

echo "Test database initialized successfully"