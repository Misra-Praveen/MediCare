# MediCare+

MediCare+ is a backend-focused pharmacy management application designed to handle real-world inventory, billing, returns, and reporting workflows in a scalable and audit-safe manner.

This project is built as a self-initiated, production-style backend system using Node.js, MongoDB, and TypeScript.

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- TypeScript
- JWT Authentication

---

## Core Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin / Staff)
- Protected routes using middleware

---

### Medicine Inventory Management
- Category and sub-category support
- Medicine creation and updates
- Stock tracking with low-stock alerts
- Expiry date management
- Search, filter, and pagination APIs

---

### Billing System
- Medicine billing with snapshot pricing
- Transaction-safe stock deduction
- Multiple payment modes
- Immutable billing records
- Pagination and date-based bill retrieval

---

### Returns & Refunds
- Partial and multiple returns per bill
- Audit-safe return handling
- Automatic stock add-back on returns
- Refund amount calculation
- Transaction-based consistency using MongoDB sessions

---

### Reports & Analytics
- Dashboard summary (daily revenue, bills, refunds)
- Date-range sales reports
- Top-selling medicines
- Low stock report
- Expiry report (upcoming expirations)

All analytics are implemented using MongoDB aggregation pipelines without introducing additional schemas.

---

## Project Structure

MediCare+/
|--- backend/
      |--- src/
            |--config/
            |--controllers/
            |--middleware/
            |--models/
            |--routes/
            |--utils/
|── .gitignore
|── README.md

---

## Backend Setup

1. Navigate to backend folder
   ```bash
   cd backend
   ```
2. Install dependencies
    ```bash
    npm install
    ```
3. Create a .env file
    ```
    PORT=4000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret

    ```
4. Start the development server
    ```bash
    npm run dev
    ```