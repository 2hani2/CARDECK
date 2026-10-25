# CARDECK — Car Dealership Inventory System

CARDECK is a car dealership inventory management web application. Visitors can explore and filter vehicles, while authenticated administrators can manage dealership inventory.

**Repository:** https://github.com/2hani2/CARDECK

## Features

### Vehicle discovery
- Browse the vehicle collection.
- Search by make or model.
- Filter by category and minimum/maximum price.
- View vehicle category, make, model, stock quantity, ID, and price.

### Authentication and administration
- Register and sign in.
- Role-based access control for administrator actions.
- Add, edit, and delete vehicles.

### Inventory and purchasing
- Purchase requests require authentication.
- Successful purchases reduce available stock.
- Purchases are rejected when stock is zero.
- Administrators can restock vehicles.

## Technology stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Authentication:** JSON Web Tokens (JWT)
- **Testing:** Vitest and the project's backend test setup

## Screenshots

### Homepage
![CARDECK homepage](car-dealership/screenshots/homepage.png)

### Vehicle inventory and filters
![Vehicle inventory and filters](car-dealership/screenshots/inventory.png)

### Vehicle cards
![Vehicle cards](car-dealership/screenshots/vehicle-cards.png)

### Featured cars
![Featured cars on the homepage](car-dealershipscreenshots/featured-cars.png)

### Sign-in page
![CARDECK sign-in page](car-dealership/screenshots/admin_login.png)

### Admin inventory management
![Admin inventory management form](car-dealership/screenshots/admin_management.png)

### Editing inventory
![Admin inventory editing view](car-dealership/screenshots/admin_edit.png)

## Prerequisites

- Node.js and npm
- MySQL Server
- Git

## Run locally

### 1. Clone the repository

```bash
git clone https://github.com/2hani2/CARDECK.git
cd CARDECK
```

### 2. Configure MySQL and environment variables

Create the database and the tables required by the backend. From the repository root:

```bash
cd backend
cp .env.example .env
```

Set the values in `backend/.env` to match your local MySQL setup:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=car_dealership
JWT_SECRET=replace_with_a_long_random_secret
PORT=3000
```

Do not commit `.env` or share real database credentials or JWT secrets.

**Database schema note:** Ensure the `users` and `vehicles` tables required by the backend exist before starting the server. Use the project's schema/migration file if one is included in your checkout.

### 3. Install dependencies and start the backend

From the repository root:

```bash
cd backend
npm install
npm run dev
```

If `backend/package.json` does not define a `dev` script, use the start script defined there.

The API is configured to run at `http://localhost:3000` when `PORT=3000`.

### 4. Start the frontend

Open a second terminal at the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. The frontend is configured to call `http://localhost:3000/api`.

## API overview

The backend provides health checks, authentication, and vehicle inventory endpoints. Vehicle routes support listing/searching and administrator-protected create, update, and delete operations. Purchase and restock operations are also implemented.

Check `backend/src/routes/` for exact endpoint paths and request formats.

## Tests

Run backend tests:

```bash
cd backend
npm test
```

Run frontend tests:

```bash
cd frontend
npm test
```

Latest development results recorded during work:
- **Backend:** 36 tests passed across 10 test files.
- **Frontend:** 3 tests passed in 1 test file.
- **Frontend production build:** `npm run build` completed successfully.

Rerun the commands above to verify your current checkout. See [`TEST_REPORT.md`](TEST_REPORT.md) for the test report.

## My AI Usage

AI tools were used as development assistance for tasks such as understanding errors, discussing implementation approaches, and improving documentation. I reviewed and tested resulting changes rather than treating AI output as automatically correct.

Before submission, edit this section so it accurately describes your own AI usage. The assignment also requests a root-level `PROMPTS.md` containing raw, unedited AI conversation logs or public conversation links. Add genuine records there before submitting; do not submit placeholders or AI-generated summaries as raw logs.

## Project structure

```text
CARDECK/
├── backend/       # Express API, database access, middleware and tests
├── frontend/      # React + Vite application
├── docs/
│   └── screenshots/
├── README.md
├── PROMPTS.md
└── TEST_REPORT.md
```

## Current scope and limitations

- Showcase/demo vehicles displayed by the frontend may not be persisted database records. Use database-backed vehicles for real inventory operations.
- Configure database schema and credentials for your own environment before running the application.
- Add genuine AI conversation records to `PROMPTS.md` before submission.
