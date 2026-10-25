# CARDECK Test Report

## 1. Overview

This report documents the automated test results recorded during development of the CARDECK Car Dealership Inventory System.

**Testing tools**
- Backend: Vitest and Supertest
- Frontend: Vitest and React Testing Library

## 2. Backend Test Results

**Command**

```bash
cd backend
npm test
```

**Latest recorded results**
- Test files passed: 10
- Tests passed: 36
- Tests failed: 0

The backend tests cover authentication, login, protected routes, database-related behavior, vehicle creation, listing, updating, deletion, and inventory purchase/restock functionality.

## 3. Frontend Test Results

**Command**

```bash
cd frontend
npm test -- --run
```

**Latest recorded results**
- Test files passed: 1
- Tests passed: 3
- Tests failed: 0

The frontend tests cover:
1. Displaying the inventory heading and loading vehicles.
2. Filtering vehicles by search text.
3. Showing a showcase notice when the backend cannot be reached.

## 4. Purchase and Restock Test Details

The dedicated test file `backend/tests/purchaseRestock.test.js` contains five tests covering:

- Requiring authentication to purchase a vehicle.
- Decreasing vehicle quantity after a successful purchase.
- Rejecting purchases when stock is zero.
- Rejecting restock requests from regular users.
- Increasing stock for administrators.

**Recorded result:** All five tests passed.

These five tests are included in the backend total and are not additional tests.

## 5. Combined Test Results

| Component | Test files passed | Tests passed | Tests failed |
|---|---:|---:|---:|
| Backend | 10 | 36 | 0 |
| Frontend | 1 | 3 | 0 |
| **Total** | **11** | **39** | **0** |

## 6. Frontend Production Build

The frontend production build was successfully completed during development.

**Command**

```bash
npm --prefix frontend run build
```

The recorded output confirmed that Vite completed the production build successfully. The build should be rerun before final submission to verify the current code.

## 7. Manual Verification

During the latest local run:

- The frontend development server started successfully using Vite.
- The CARDECK homepage loaded successfully in the browser at `http://localhost:5177/`.
- The frontend and backend automated test suites passed as recorded above.

This manual check confirms that the homepage loads. It does not establish that every feature, including authentication, purchasing, restocking, and administrator operations, has been manually verified.

## 8. Reproducing the Results

Run the backend tests from the project root:

```bash
cd backend
npm test
```

Run the frontend tests in a separate terminal:

```bash
cd frontend
npm test -- --run
```

To verify the production build:

```bash
npm --prefix frontend run build
```

The results in this report reflect the development runs recorded above. Rerun the commands before final submission to verify the current code.

## 9. Limitations

This report documents automated test results and the specific manual check described above. It does not claim that every project requirement has been tested, that a formal code coverage percentage has been measured, or that the application has undergone independent security testing.