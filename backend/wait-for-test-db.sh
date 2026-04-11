#!/bin/sh
# scripts/wait-for-test-db.sh

set -e

host="${DB_HOST}"
port="${DB_PORT}"
user="${DB_USER}"
password="${DB_PASSWORD}"
db="${DB_NAME}"

echo "Waiting for test database at $host:$port..."

until PGPASSWORD=$password psql -h "$host" -p "$port" -U "$user" -d "$db" -c '\q' 2>/dev/null; do
  >&2 echo "Test database is unavailable - sleeping"
  sleep 1
done

echo "Test database is ready!"

# Run migrations
npm run migrate:up -- --env test

echo "Test database initialized successfully"