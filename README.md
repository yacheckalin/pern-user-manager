# Fullstack Node.js + PostgreSQL Application

A modern fullstack web application built with Express.js backend, React frontend, and PostgreSQL database. The application includes Docker support for easy local development and deployment.

## 🎯 Project Overview

This is a complete fullstack application with:

- **Backend**: Express.js REST API with PostgreSQL
- **Frontend**: React application
- **Database**: PostgreSQL with migrations
- **Admin Panel**: pgAdmin for database management
- **Containerization**: Docker and Docker Compose

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Docker** and **Docker Compose** - [Download](https://www.docker.com/products/docker-desktop)
- **PostgreSQL Client** (optional, for local development without Docker)

## 🚀 Quick Start with Docker (Recommended)

The easiest way to get started is using Docker Compose, which sets up the entire stack with one command.

### 1. Clone and Setup

```bash
# Navigate to the project directory
cd /path/to/project

# Start all services
docker compose up
```

This will:

- Start PostgreSQL database on port 5432
- Run database migrations automatically
- Start the Express.js backend on port 5000
- Start the React frontend on port 5173
- Start pgAdmin on port 5050
- Start Prometheus on port 9090
- Start VictoriaMetrics on port 8428
- Start Dozzle on port 8888

### 2. Access the Application

Once running, access the following URLs:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **pgAdmin**: http://localhost:5050
  - Email: `admin@admin.com`
  - Password: `admin`
- **Prometheus**: http://localhost:9090
- **Dozzle**: http://localhost:8888
- **VictoriaMetrics**: http://localhost:8428

### 3. Database Access

In pgAdmin, add a new server with:

- **Hostname**: `db`
- **Username**: `postgres`
- **Password**: `secret_password`
- **Database**: `my_database`

### Stopping Services

To stop all services:

```bash
docker compose down
```

To stop and remove all data (including database):

```bash
docker compose down -v
```

## 💻 Local Development (No Docker)

For development without Docker, follow these steps:

### 1. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
echo "DATABASE_URL=postgres://postgres:secret_password@db:5432/my_database" > .env
echo "NODE_ENV=development" >> .env

# Run migrations
npm run migrate:up

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Setup Frontend

In another terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will open at `http://localhost:5173`

### 3. Setup Database (if not using Docker)

You need a PostgreSQL database running locally. You can:

**Option A: Install PostgreSQL locally**

- Download from [postgresql.org](https://www.postgresql.org/download/)
- Create database: `my_database`
- Create user: `postgres` with password `secret_password`

**Option B: Run PostgreSQL in Docker only**

```bash
docker compose up db
```

## 📦 Available Scripts

### Backend Scripts

Navigate to `backend/` directory:

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Run tests
npm test
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:watch
npm run test:ci
npm run test:debug

# Apply all new migrations
npm run migrate

# Create a new migration
npm run migrate:create "your-migration-name"

# Apply pending migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down
```

### Frontend Scripts

Navigate to `frontend/` directory:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Start preview
npm run preview
```

## 🏗️ Project Structure

```
root/
├── backend/                    # Express.js backend
│   ├── config
│   │   ├── database.js         # Database connection wrapper
│   ├── migrations/             # Database migrations
|   ├── controllers             # Controllers
|   |   ├── user.controller.js
|   ├── constants
|   |   ├── index.js            # Export all constants
|   |   ├── app.constants.js    # Application constants
|   |   ├── http.constants.js   # HTTP status constants
|   |   ├── error.constants.js  # Errors constants
|   |   ├── user.constants.js   # User domain constants
|   ├── models                  # Models
|   |   ├── user.model.js
|   ├── schemas                 # Validation Schemas
|   |   ├── user.schema.js      # Joi schema object
|   ├── repositories            # Repositories
|   |   ├── user.repo.js
|   ├── routes                  # Routes
|   |   ├── user-routes.js
|   ├── services                # Services (Dependency injection)
|   |   ├── user.service.js
|   ├── middlewares             # Middlewares (middleware, etc.)
|   |   ├── error-handler.js
|   |   ├── validation.js       # validation middleware
|   ├── tests                   # Tests
|   |   ├── unit                # Unit Tests
|   |   |   ├── constants
|   |   |   |   ├── app.constants.test.js
|   |   |   |   ├── error.constants.test.js
|   |   |   |   ├── http.constants.test.js
|   |   |   |   ├── user.constants.test.js
|   |   |   ├── models
|   |   |   |   ├── user.model.test.js
|   |   |   ├── controllers
|   |   |   |   ├── user.controller.test.js
|   |   |   ├── repositories
|   |   |   |   ├── user.repo.test.js
|   |   |   ├── schemas
|   |   |   |   ├── user.schema.test.js
|   |   |   ├── services
|   |   |   |   ├── user.service.test.js
|   |   ├── integration         # Integration Tests
|   |   ├── e2e                 # End-2-End Tests
|   |   ├── setup               # Base Setup for tests
|   ├── .gitignore
|   ├── Dockerfile
|   ├── package.json
|   ├── index.js                # Entry point
│
├── frontend/                   # React frontend (Vite)
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml         # Docker Compose configuration
├── docker-compose.test.yml    # Docker Compose configuration (Integration & E2E)
└── README.md
```

## 🗄️ Database Schema

### Users Table

The application comes with a `users` table with the following structure:

```sql
CREATE TABLE IF NOT EXISTS users(
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


CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_username_created_at ON users(username, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_activated_at ON users(activated_at) WHERE activated_at IS NULL;


CREATE TABLE IF NOT EXISTS app.refresh_tokens(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id BIGINT NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL,
      expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      revoked_at TIMESTAMPTZ,
      replaced_by_token_id UUID,
      user_agent TEXT,
      ip_address INET
);

 ALTER TABLE app.refresh_tokens DROP CONSTRAINT IF EXISTS fk_replaced_by_token_id;

ALTER TABLE app.refresh_tokens
    ADD CONSTRAINT fk_replaced_by_token_id FOREIGN KEY (replaced_by_token_id)
    REFERENCES app.refresh_tokens(id) ON DELETE SET NULL

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON app.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON app.refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON app.refresh_tokens(expires_at);


```

## 🔌 API Endpoints

### Users API

Base URL: `http://localhost:5000/users`

**Available endpoints:**

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user by ID
- `PATCH /api/v1/users/:id/password` - Change user password by ID
- `DELETE /api/v1/users/:id` - Delete user by ID
- `PATCH /api/v1/users/:id/activate` - Activate user by ID
- `POST /api/v1/users/register` - Register a new user

- `POST /api/v1/auth/login` - Authenticate user username(username |email, password)
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Rotate Access/Refresh Tokens

- `GET /api/v1/metrics` - Get metrics
- `GET /api/v1/docs` - Swagger UI documentation

## ✅ Testing

### Backend Tests

```bash
cd backend

# Run all tests with coverage
npm run test --> NODE_OPTIONS=--experimental-vm-modules jest --coverage

# Run all unit tests
npm run test:unit --> NODE_OPTIONS=--experimental-vm-modules jest --testPathPatterns=tests/unit

# Run all integration tests (localy)
npm run test:integration --> NODE_OPTIONS=--experimental-vm-modules jest --testPathPatterns=tests/integration

# Run all e2e tests (localy)
npm run test:e2e --> NODE_OPTIONS=--experimental-vm-modules jest --config=jest.e2e.config.js --runInBand

# Run all tests in watch mode (localy)
npm run test:watch --> NODE_OPTIONS=--experimental-vm-modules jest --watch

# Run all tests in CI mode (optimized for servers, limiting CPU usage)
npm run test:ci --> NODE_OPTIONS=--experimental-vm-modules jest --coverage --maxWorkers=2

# Run all tests in debug mode
npm run test:debug --> NODE_OPTIONS=--experimental-vm-modules node --inspect-brk node_modules/.bin/jest --runInBand

# Run all tests in docker containers
npm run test:docker --> cd .. && (docker compose -f docker-compose.test.yml up --abort-on-container-exit --exit-code-from app_test || true) && docker image prune -f

# Run all integration tests in docker containers
npm run test:integration:docker --> cd .. && docker compose -f docker-compose.test.yml build app_test && (TEST_COMMAND=test:integration docker compose -f docker-compose.test.yml up --abort-on-container-exit --exit-code-from app_test || true) && docker image prune -f


# Run all e2e tests in docker containers
npm run test:e2e:docker --> cd .. && docker compose -f docker-compose.test.yml build --no-cache app_test && (TEST_COMMAND=test:e2e docker compose -f docker-compose.test.yml up --abort-on-container-exit --exit-code-from app_test || true) && docker image prune -f


# Remove docker containers for integration/e2e tests
npm run test:docker:down --> cd .. && docker compose -f docker-compose.test.yml down -v
```

Test files are located alongside source files with `.test.js` extension.

#### NODE_OPTIONS=--experimental-vm-modules?

Jest requires this flag to handle the "Virtual Machine" modules correctly. Without it, Jest would throw errors saying it doesn't recognize the import statement.

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🔄 Database Migrations

Migrations are managed using `node-pg-migrate`. Migrations are automatically run on Docker startup.

### Create a New Migration

```bash
cd backend
npm run migrate:create -- --name "migration-name"
```

This creates a new migration file in `backend/migrations/`

### Apply Migrations

```bash
cd backend

# Apply all pending migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down
```

## 🔧 Environment Variables

### Backend

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgres://postgres:secret_password@localhost:5432/my_database
NODE_ENV=development
```

When using Docker Compose, these are configured in `docker-compose.yml`

---

## 📊 Monitoring & Observability

The project includes a built-in system for metrics collection and real-time log viewing. To keep the development environment lightweight, these services are managed via **Docker Profiles** and are disabled by default.

### Key Components:

- **VictoriaMetrics** – A high-performance time-series database used as the primary metrics storage.
- **Prometheus** – The industry-standard interface for running PromQL queries and monitoring target health.
- **Dozzle** – A lightweight, web-based real-time log viewer for all running containers.

### How to Enable Monitoring

To start the application with the full monitoring stack, use the `--profile` flag:

```bash
docker compose --profile monitoring up -d
```

## 🐛 Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find process using port 5000 (backend)
lsof -i :5000

# Find process using port 3000 (frontend)
lsof -i :5173

# Find process using port 5432 (database)
lsof -i :5432

# Kill process (replace PID with actual process ID)
kill -9 <PID>

# Or start Docker services on different ports
docker compose -f docker-compose.yml -p custom_name up
```

### Database Connection Issues

```bash
# Test database connection
psql -U postgres -h localhost -d my_database -c "SELECT 1"

# View Docker logs
docker compose logs db

# Restart database
docker compose restart db
```

### Application Not Starting

```bash
# View detailed logs
docker compose logs -f

# Rebuild containers
docker compose down
docker compose up --build

# Check if ports are available
netstat -an | grep LISTEN
```

### Migrations Not Running

```bash
# Check migration status
cd backend && npm run migrate:up

# Run migration inside docker container
docker exec node_backend npm run migrate
docker exec node_backend npm run migrate:up
docker exec node_backend npm run migrate:down

# View Docker backend logs
docker compose logs backend

# Reset database (careful - deletes all data)
docker compose down -v
docker compose up
```

## 📚 Dependencies

### Backend

- **express** - Web framework
- **pg** - PostgreSQL client
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **node-pg-migrate** - Database migrations
- **jest** - Testing framework
- **joi** - Validation request data (Infrastruction Layer)
- **validator** - Sanitizing request data (Business Layer)
- **nodemon** - Development auto-reload
- **supertest** - HTTP testing
- **morgan** - HTTP request logger
- **winston** - Universal logging library
- **jsonwebtoken** - JSON Web Token implementation
- **yamljs** - YAML parser and stringifier
- **swagger-ui-express** - API Documentation UI
- **dotenv-cli** - CLI for dotenv

### Frontend

- **react** - UI library
- **react-dom** - React DOM rendering
- **vite** - Vite

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Write or update tests
4. Ensure all tests pass
5. Create a pull request

## 🆘 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review Docker logs: `docker compose logs`
3. Check application tests for usage examples
4. Review module-specific README files if available

## 📄 MIT License

This project is provided as-is for educational and development purposes.
