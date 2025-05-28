# MoveSync Assignment 2

A Node.js, Express, and Prisma-based event booking API with PostgreSQL, supporting authentication, event management, and booking features.

## Features

- User authentication (signup/login)
- Event creation, update, deletion, and listing
- Booking and cancellation of events
- Admin and user roles
- Dockerized for easy deployment

## Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started (Docker)

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd moveSyncAssg2
   ```

2. **Set up environment variables:**

   - The main environment variables are already set in `docker-compose.yml`.
   - Change `JWT_SECRET` in `docker-compose.yml` to a secure value for production.

3. **Build and start the containers:**

   ```bash
   docker-compose up --build
   ```

   This will start both the Node.js app and PostgreSQL database.

4. **Access the API:**

   - The API will be available at [http://localhost:3000](http://localhost:3000)

5. **Stopping the containers:**
   ```bash
   docker-compose down
   ```

## Local Development (without Docker)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up a local PostgreSQL database and update your `.env` file:
   ```env
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<db_name>
   JWT_SECRET=your_secret
   ```
3. Run migrations and generate Prisma client:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
4. Start the server:
   ```bash
   node src/index.js
   ```

## Project Structure

- `src/` - Source code (controllers, routes, middleware, etc.)
- `prisma/` - Prisma schema and migrations
- `generated/` - Generated Prisma client
- `docker-entrypoint.sh` - Entrypoint script for Docker

## API Routes

### Authentication

- **POST /api/auth/signup** - Register a new user
- **POST /api/auth/login** - Login and receive a JWT token

### Events

- **GET /api/events** - List all events (with pagination)
- **GET /api/events/:id** - Get a specific event by ID
- **POST /api/events** - Create a new event (requires admin role)
- **PUT /api/events/:id** - Update an event (requires admin role)
- **DELETE /api/events/:id** - Delete an event (requires admin role)

### Bookings

- **POST /api/bookings** - Create a new booking for an event
- **GET /api/bookings** - List all bookings for the authenticated user
- **PUT /api/bookings/:id/cancel** - Cancel a booking (requires the booking owner)
