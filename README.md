# Campus Carpool Finder

A full-stack MERN carpooling web platform designed for college communities to share rides, split travel costs, and commute safely.

Built as part of the **Fundamentals of Agile Software Development Lab** by a team of 4 B.Tech CSE students.

---

## Architecture Overview

- **Frontend**: React (Vite), React Router DOM, Axios, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js REST API
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Token), bcryptjs password hashing

---

## Project Structure

```
CampusCarpoolFinder/
├── backend/
│   ├── src/
│   │   ├── config/             # DB configuration (db.js)
│   │   ├── controllers/        # Request handlers (authController, userController, etc.)
│   │   ├── middleware/         # Auth guard & centralized errorHandler
│   │   ├── models/             # Mongoose schemas (User, Ride, etc.)
│   │   ├── routes/             # Express API routes (/api/auth, /api/users, etc.)
│   │   ├── utils/              # Token & utility helpers
│   │   └── server.js           # Server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Common UI & Layouts (Navbar, Footer, ProtectedRoute)
│   │   ├── context/            # AuthContext
│   │   ├── pages/              # Home, Login, Register, Dashboard, Profile
│   │   ├── services/           # Axios API instance and endpoints
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── package.json
```

---

## Quickstart Guide

### 1. Backend Setup
1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Configure `.env` file (copy from `.env.example` if needed):
   ```env
   PORT=5001
   MONGO_URI=mongodb://127.0.0.1:27017/campus_carpool
   JWT_SECRET=supersecret_jwt_key_campus_carpool_2026
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```
   *(Note: If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string).*
3. Start the backend development server:
   ```bash
   npm run dev
   # Server will start on http://localhost:5001
   ```

### 2. Frontend Setup
1. In a separate terminal, navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Verify `.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   # Vite will start on http://localhost:3000
   ```

---

## Sprint 1 Features Implemented
- [x] Full-stack architecture & monorepo scaffold
- [x] MongoDB database connection configuration
- [x] User Mongoose Model with bcrypt password encryption
- [x] JWT token generation and authorization middleware (`protect`, `authorize`)
- [x] RESTful Auth APIs:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- [x] RESTful User Profile & Vehicle APIs:
  - `GET /api/users/:id`
  - `PUT /api/users/profile`
  - `PUT /api/users/vehicle`
- [x] Centralized error handling middleware with JSON error formatting
- [x] Frontend Single Page Application with React Router DOM:
  - Responsive Navigation Bar with dynamic auth states & mobile drawer
  - Hero Landing Page (`/`)
  - Student Registration Page (`/register`)
  - Login Page (`/login`)
  - Protected Student Dashboard (`/dashboard`)
  - Student Profile & Vehicle Management (`/profile`)
- [x] Reusable `ProtectedRoute` guard and Axios JWT request interceptor

---

## Sprint 2 Features Implemented
- [x] **Ride Model & Database Indexes**:
  - Origin, destination, departure date/time, total seats, available seats, cost-sharing amount, vehicle specifications, status (`active`, `completed`, `cancelled`), and confirmed passenger references.
  - Text search indexes on origin and destination.
- [x] **Ride Request Model & Integrity Constraints**:
  - References ride, rider, and driver.
  - Compound unique index `{ ride: 1, rider: 1 }` strictly prohibiting duplicate requests.
- [x] **RESTful Ride APIs**:
  - `POST /api/rides` - Create a ride (with auto-filled vehicle details)
  - `GET /api/rides` - Search and filter rides by origin, destination, date, and minimum seats
  - `GET /api/rides/:id` - Fetch ride details with populated driver and co-passengers
  - `GET /api/rides/user/my-rides` - Fetch rides offered by the logged-in driver
  - `PUT /api/rides/:id/cancel` - Cancel a posted ride
- [x] **RESTful Ride Request APIs & Concurrency Control**:
  - `POST /api/requests` - Request to join a ride (prevents joining own rides or full rides)
  - `GET /api/requests/driver` - Fetch pending and processed requests for driver's rides
  - `GET /api/requests/rider` - Track submitted requests and statuses
  - `PUT /api/requests/:id/status` - Driver accepts or rejects request
  - **Atomic Seat Updates**: Conditional `$inc` update prevents overbooking even when multiple requests compete for the final seat!
  - `PUT /api/requests/:id/cancel` - Rider cancels pending or accepted requests (restoring seat counts)
- [x] **Sprint 2 UI Pages**:
  - **Post a Ride (`/post-ride`)**: Form with vehicle pre-fill, location inputs, seat counters, and price configuration.
  - **Find a Ride (`/search-rides`)**: Filter bar for origin, destination, date, and seats; dynamic results grid.
  - **Ride Details (`/rides/:id`)**: Journey timeline, driver rating card, vehicle specs, and seat request form.
  - **My Rides Hub (`/my-rides`)**:
    - "Rides I'm Driving" tab with incoming passenger requests and one-click Accept/Reject.
    - "My Join Requests" tab with live status badges (`pending`, `accepted`, `rejected`).

---

## Sprint 3 Features Implemented
- [x] **Mutual Ratings & Reviews**:
  - Mongoose `Rating` model with compound unique index `{ ride: 1, fromUser: 1, toUser: 1 }` preventing duplicate ratings.
  - Auto-recalculating recipient's average rating and total review counter.
  - `POST /api/ratings` (Only confirmed journey participants can submit ratings).
  - `GET /api/ratings/user/:id` (Fetch all reviews for a student).
  - Interactive React `RatingModal` with dynamic 5-star selector and review input.
- [x] **In-App Notification System**:
  - Notification model storing alerts for:
    - `REQUEST_RECEIVED` (Driver notified of incoming seat request)
    - `REQUEST_ACCEPTED` (Rider notified when driver approves)
    - `REQUEST_REJECTED` (Rider notified if declined)
    - `NEW_RATING` (Alert when co-traveller rates experience)
  - `GET /api/notifications` (Fetch user notifications with unread counter).
  - `PUT /api/notifications/:id/read` & `PUT /api/notifications/read-all`.
  - Notification center page (`/notifications`) with type-specific badges and timestamps.
- [x] **Campus Moderator Portal (Admin)**:
  - Role-protected endpoints (`authorize('admin')`):
    - `GET /api/admin/stats` (Active platform analytics: users, rides, requests, reviews).
    - `GET /api/admin/users` (Search and list students with moderation delete actions).
    - `DELETE /api/admin/users/:id` (Remove fraudulent accounts and clean up their rides).
    - `GET /api/admin/rides` & `DELETE /api/admin/rides/:id` (Remove inappropriate rides).
  - Modern Admin Dashboard view (`/admin`).
- [x] **Automated Testing Suite (Jest & Supertest)**:
  - 19 automated integration tests passing in `backend/tests/api.test.js` using self-contained in-memory MongoDB.
  - Covers authentication, invalid inputs, duplicate checks, ride search, atomic seat decrement, and ratings.
- [x] **Production Deployment Configurations**:
  - Frontend SPA routing rewrites: `frontend/vercel.json`.
  - Backend deployment blueprint: `backend/render.yaml`.
  - Exported Postman Collection: `backend/tests/CampusCarpool.postman_collection.json`.


