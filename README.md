# Fullstack Node.js + PostgreSQL Application

A modern fullstack web application built with Express.js backend, React frontend, and PostgreSQL database. The application includes Docker support for easy local development and deployment.

## 🎯 Project Overview

This is a complete fullstack application with:

- **Backend**: Express.js REST API with PostgreSQL
- **Frontend**: React application (Not yet implemented)
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
- Start the React frontend on port 3000
- Start pgAdmin on port 5050

### 2. Access the Application

Once running, access the following URLs:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **pgAdmin**: http://localhost:5050
  - Email: `admin@admin.com`
  - Password: `admin`

### 3. Database Access

In pgAdmin, add a new server with:

- **Hostname**: `db`
- **Username**: `user`
- **Password**: `password`
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
echo "DATABASE_URL=postgres://user:password@localhost:5432/my_database" > .env
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

The frontend will open at `http://localhost:3000`

### 3. Setup Database (if not using Docker)

You need a PostgreSQL database running locally. You can:

**Option A: Install PostgreSQL locally**

- Download from [postgresql.org](https://www.postgresql.org/download/)
- Create database: `my_database`
- Create user: `user` with password `password`

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
```

## ✅ Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

Test files are located alongside source files with `.test.js` extension.

## 🔧 Environment Variables

### Backend

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgres://user:password@localhost:5432/my_database
NODE_ENV=development
```

When using Docker Compose, these are configured in `docker-compose.yml`

## 🐛 Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find process using port 5000 (backend)
lsof -i :5000

# Find process using port 3000 (frontend)
lsof -i :3000

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
psql -U user -h localhost -d my_database -c "SELECT 1"

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

## 📚 Dependencies

### Backend

- **express** - Web framework
- **pg** - PostgreSQL client
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **node-pg-migrate** - Database migrations
- **jest** - Testing framework
- **nodemon** - Development auto-reload
- **supertest** - HTTP testing

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Write or update tests
4. Ensure all tests pass
5. Create a pull request

## 📝 Notes

- The application uses a dependency injection pattern in the backend (see `src/container.js`)
- Error handling is centralized in `src/shared/errors/error-handler.js`
- Database connection is managed in `src/db.js`
- Hot reload is enabled for both backend (nodemon) and frontend (React scripts)

## 🆘 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review Docker logs: `docker compose logs`
3. Check application tests for usage examples
4. Review module-specific README files if available

## 📄 MIT License

This project is provided as-is for educational and development purposes.
