# 🛠 StyleDecor – Decoration Booking System (Server)

A RESTful backend API for managing decoration services, bookings, payments, and role-based access control.

Built using **Node.js**, **Express.js**, **MongoDB**, **Firebase Admin SDK**, and **Stripe**.

---

## 🌐 API Base URL
🔗 https://decoration-booking-system-server.vercel.app

---

## 🎯 Purpose

This server handles:
- User & role management
- Service & category management
- Booking lifecycle
- Secure Stripe payments
- Decorator assignment & project tracking

---

## 🧠 Core Features

- Firebase JWT authentication
- Role-based authorization (User / Admin / Decorator)
- Service CRUD operations
- Booking creation, update, deletion
- Stripe payment integration
- Payment history storage
- Decorator approval workflow
- Project status updates

---

## 🔐 Authentication & Authorization

- Firebase ID Token verification
- Middleware-based role protection
- Admin-only & Decorator-only routes

---

## 📦 Main API Endpoints

### Users
- `POST /users`
- `GET /users/:email/role`
- `GET /users` (Admin only)

### Services
- `GET /services`
- `GET /services/:id`
- `POST /services` (Admin)
- `PATCH /services/:id` (Admin)
- `DELETE /services/:id` (Admin)

### Bookings
- `POST /bookings`
- `GET /bookings`
- `DELETE /bookings/:id`
- `PATCH /bookings/:id/assign` (Admin)
- `PATCH /bookings/:id/status` (Decorator)

### Decorators
- `POST /decorators`
- `GET /decorators`
- `PATCH /decorators/:id/approve` (Admin)
- `PATCH /decorators/:id/reject` (Admin)

### Payments
- `POST /create-payment-intent`
- `PATCH /payment-success`
- `GET /payments`

### Categories
- `GET /services-categories`

---

## 🧩 Tech Stack

**Backend**
- Node.js
- Express.js
- MongoDB
- Firebase Admin SDK
- Stripe
- dotenv
- cors

---

## ⚙️ Environment Variables

Create a `.env` file in the server root:

```bash
PORT=3000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
STRIPE_KEY=your_stripe_secret_key
SITE_DOMAIN=https://your-client-site.web.app
```

---

## 🚀 Run Locally

```bash

## Clone the repo
git clone https://github.com/SadnurIslam/Decoration-Booking-System-Server

# Go to server directory
cd Decoration-Booking-System-Server

# Install dependencies
npm install

# Run the server
npm run start

Server runs on:
http://localhost:5000
```

---

## 🧾 Database Collections

```bash

users

services

bookings

payments

decorators

service_categories
```

---

## 🧰 Dependencies

| Package | Purpose |
|---------|---------|
| express | Server framework |
| mongodb | MongoDB client |
| cors | Handle CORS |
| dotenv | Manage environment variables |
| nodemon | Auto-restart during development |
| stripe | Handling payment |

--- 

## 🧑‍💻 Developer Info

**Developer:** [Sadnur Islam](https://github.com/SadnurIslam)  
**Contact:** sadnurislam@gmail.com  