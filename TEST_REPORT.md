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

**Recorded results**
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

**Recorded results**
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

These five tests are included in the backend total; they are not additional tests.

## 5. Combined Results

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

The recorded build output reported that Vite completed the production build successfully.

## 7. Reproducing the Results

Run the backend and frontend tests independently from their respective directories:

```bash
cd backend
npm test
```

In a separate terminal, from the project root:

```bash
cd frontend
npm test -- --run
```

To verify the frontend production build:

```bash
npm --prefix frontend run build
```

The results above reflect development-time runs. Rerun the commands before final submission to verify the current code.

## 8. Limitations

This report documents automated test results only. It does not claim that every project requirement has been tested, that a formal code coverage percentage has been measured, or that the application has undergone independent security testing.