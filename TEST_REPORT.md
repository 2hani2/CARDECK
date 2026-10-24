# CARDECK Test Report

## 1. Overview

This report records the automated test results obtained during development of the CARDECK Car Dealership Inventory System.

Testing tools:
- Backend: Vitest and Supertest
- Frontend: Vitest and React Testing Library

## 2. Backend Test Results

Command:

```bash
cd backend
npm test
```

Recorded result:
- Test files passed: 10
- Tests passed: 36
- Tests failed: 0

Coverage areas include authentication, login, protected routes, database connectivity, vehicle creation, listing, updating, deletion, and purchase/restock inventory behavior.

## 3. Frontend Test Results

Command:

```bash
cd frontend
npm test -- --run
```

Recorded result:
- Test files passed: 1
- Tests passed: 3
- Tests failed: 0

The frontend tests cover:
1. Displaying the inventory heading and loading vehicles.
2. Filtering vehicles by search text.
3. Showing a showcase notice when the backend cannot be reached.

## 4. Purchase and Restock Test Details

The dedicated backend test file `backend/tests/purchaseRestock.test.js` contains five tests covering:
- Requiring authentication to purchase.
- Decreasing vehicle quantity after purchase.
- Rejecting purchases when stock is zero.
- Rejecting restock requests from regular users.
- Increasing stock for administrators.

Recorded result: all five tests passed.

## 5. Combined Results

| Component | Test files passed | Tests passed | Tests failed |
|---|---:|---:|---:|
| Backend | 10 | 36 | 0 |
| Frontend | 1 | 3 | 0 |
| Total | 11 | 39 | 0 |

## 6. Reproducing the Results

Run the backend and frontend test commands independently from their respective directories.

The results above are from development test runs. They should be rerun before final submission if the code changes.

## 7. Limitations

This report records automated test results only. It does not claim that every requirement has been tested, that a formal coverage percentage has been measured, or that the application has undergone independent security testing.
