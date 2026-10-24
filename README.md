# CARDECK — Car Dealership Inventory System

CARDECK is a full-stack car dealership inventory management application. It provides vehicle listing, search and filtering, administrator-controlled inventory management, authentication, and stock purchase/restock operations.

## Features

### Authentication and authorization
- User registration and login
- JWT-based authentication
- Role-based authorization for administrator operations

### Vehicle inventory
- List available vehicles
- Search by vehicle make or model
- Filter by category and price range
- Create, update, and delete vehicle records (administrator only)
- Purchase a vehicle to reduce stock by one
- Restock vehicles (administrator only)
- Prevent purchases when stock is zero

### Frontend
- React-based interface
- Vehicle inventory browsing and search
- Showcase vehicles when the backend cannot be reached

Note: Showcase vehicles are demonstration content, not necessarily records saved in the database.

## Technology Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MySQL
- Authentication: JSON Web Tokens (JWT)
- Password hashing: bcryptjs
- Testing: Vitest, Supertest, React Testing Library

## Project Structure

```text
CARDECK/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── README.md
├── PROMPTS.md
└── TEST_REPORT.md
```

## Prerequisites

Install the following before running the application:

- Node.js and npm
- MySQL Server
- Git

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/2hani2/CARDECK.git
cd CARDECK
```

### 2. Configure MySQL

Create a database in MySQL:

```sql
CREATE DATABASE car_dealership;
```

The application expects a `users` table and a `vehicles` table. The vehicle table needs fields for its ID, make, model, category, price, quantity, and timestamps. The users table needs an ID, name, email, password hash, role, and creation timestamp.

Make sure your database tables match the schema used by the application before starting it. The repository's current file listing does not include a database schema or migration file.

### 3. Configure backend environment variables

Create a local environment file:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your own local MySQL credentials and a strong, private JWT secret:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=car_dealership
JWT_SECRET=replace_with_a_long_random_secret
```

Do not commit `.env` or share its secrets.

### 4. Install backend dependencies

From the `backend` directory:

```bash
npm install
```

Start the backend:

```bash
npm run dev
```

The frontend API configuration currently uses `http://localhost:3000/api`. Ensure the backend server uses the expected port.

### 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## API Overview

The API base URL is `http://localhost:3000/api`.

| Method | Endpoint | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/auth/me` | Authenticated |
| GET | `/vehicles` | Public |
| POST | `/vehicles` | Administrator |
| PUT | `/vehicles/:id` | Administrator |
| DELETE | `/vehicles/:id` | Administrator |
| POST | `/vehicles/:id/purchase` | Authenticated |
| POST | `/vehicles/:id/restock` | Administrator |

Vehicle listing supports search and filtering by make/model, category, minimum price, and maximum price.

Protected endpoints require a valid bearer token in the `Authorization` header.

## Running Tests

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test -- --run
```

### Test results recorded during development

- Backend: 36 tests passed across 10 test files.
- Frontend: 3 tests passed in 1 test file.
- Total: 39 passing tests across both test suites.

These results reflect the test runs performed during development; run the commands above to verify them in your own environment.

See [TEST_REPORT.md](TEST_REPORT.md) for the recorded summary.

## Screenshots

Add screenshots of the running application here before submitting. Suggested screenshots:

1. Homepage
2. Vehicle inventory and search/filter interface
3. Login or registration screen
4. Administrator vehicle management
5. Purchase/restock behavior, where demonstrated

Screenshots have not been included in this repository documentation yet.

## My AI Usage

AI tools, including ChatGPT, were used to assist with implementation, debugging, test development, and documentation.

The developer remains responsible for reviewing generated code, running tests, understanding the implementation, and verifying the final submission.

A record of AI prompts and responses should be provided in `PROMPTS.md` using genuine, unedited conversation logs or public chat links, as required by the assignment. Do not represent summaries or reconstructed conversations as original logs.

## Repository

GitHub: https://github.com/2hani2/CARDECK
