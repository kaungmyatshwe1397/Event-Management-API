# Event Management API

Backend API for managing concert ticket inventory, reservations, purchases, and user ticket lookups.

## Overview

This service provides a small event-management backend built with Express, TypeORM, SQLite, Redis-backed rate limiting, and Swagger documentation. It supports:

- listing concerts
- reserving tickets in a transaction
- purchasing reserved tickets
- viewing a user's tickets by status
- API documentation through Swagger UI

## Tech Stack

- Node.js, TypeScript, Express
- TypeORM with SQLite (`better-sqlite3`)
- Redis-backed rate limiting
- Zod validation
- Swagger UI / OpenAPI
- Pino logging
- `node-cron` for background ticket restocking

## Prerequisites

- Node.js 18 or later is recommended
- npm
- A Redis instance available locally or remotely

The application uses a local SQLite database file named `database.sqlite` in the project root.

## Getting Started

1. Install dependencies.

	```bash
	npm install
	```

2. Run database migrations.

	```bash
	npm run migration:run
	```

3. Seed sample data.

	```bash
	npm run seed
	```

4. Start the development server.

	```bash
	npm run dev
	```

5. Open the API documentation.

	```
	http://localhost:3000/api-docs
	```

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the API in watch mode using `ts-node-dev`. |
| `npm run build` | Compiles the TypeScript source to `dist/`. |
| `npm start` | Runs the compiled application from `dist/index.js`. |
| `npm run migration:generate -- <name>` | Generates a new TypeORM migration. |
| `npm run migration:run` | Runs pending TypeORM migrations. |
| `npm run seed` | Seeds sample concerts and users. |

Note: `npm test` is not configured yet.

## Environment Variables

The current code reads the following variables:

| Variable | Required | Description |
| --- | --- | --- |
| `REDIS_HOST` | No | Redis host used by the reservation rate limiter. Defaults to `localhost`. |
| `REDIS_PORT` | No | Redis port used by the reservation rate limiter. Defaults to `6379`. |
| `JWT_SECRET` | Only if auth middleware is enabled | Secret used to verify JWT tokens in the authentication middleware. |

## API Endpoints

### Health Check

- `GET /`

Returns a simple greeting response.

### Concerts

- `GET /concerts`

Returns all concerts.

### Reservations

- `POST /reserves`

Creates a ticket reservation transaction and reserves up to 5 tickets per request.

Request body:

```json
{
  "userId": 1,
  "concertId": 1,
  "quantity": 2
}
```

Responses:

- `200` reservation created successfully
- `409` insufficient stock or invalid concert state
- `429` rate limit exceeded

### Purchases

- `POST /purchases`

Marks a reserved ticket as completed.

Request body:

```json
{
  "ticketId": 1
}
```

Responses:

- `200` purchase completed
- `400` valid reserved ticket not found

### User Tickets

- `GET /users/:id/tickets?status=COMPLETED`

Returns a user's tickets filtered by status.

Accepted status values:

- `AVAILABLE`
- `PENDING`
- `COMPLETED`

## Sample Data

The seed script creates the following records when they do not already exist:

- concerts: `Concert A`, `Concert B`, `Concert C`
- admin user: `AdminUser` / `admin@test.com`
- normal user: `NormalUser` / `user@test.com`

## Project Structure

```text
src/
  controllers/   request handlers
  cron-tasks/     scheduled background jobs
  database/       TypeORM data source and seed script
  dtos/           response mapping helpers
  entities/       TypeORM entities
  libs/           shared utilities, schemas, and logging
  middlewares/    auth, validation, rate limiting, error handling
  migrations/     TypeORM migrations
  routes/         Express route definitions
docs/             OpenAPI specification
```

## Operational Notes

- Reservations are performed inside a database transaction to avoid overselling.
- Reservation requests are rate limited using Redis.
- Swagger UI is available at `/api-docs`.
- The application closes the HTTP server, cron task, and database connection gracefully on `SIGTERM`.

## Example Request

```bash
curl -X POST http://localhost:3000/reserves \
  -H "Content-Type: application/json" \
  -d '{"concertId": 1, "userId": 1, "quantity": 2}'
```
