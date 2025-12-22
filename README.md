# Decoration Booking System Server

## Table of Contents
- [Project Name](#project-name)
- [Purpose](#purpose)
- [Live URL](#live-url)
- [Key Features](#key-features)
- [NPM Packages Used](#npm-packages-used)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Project Name
Decoration Booking System Server (StyleDecor Backend)

## Purpose
This is the server-side component of the Decoration Booking System (StyleDecor), a modern appointment management system for a local decoration company offering in-studio consultations and on-site decoration services for homes and ceremonies. The backend handles API requests for user management, services, bookings, decorators, payments, and authentication. It integrates with MongoDB for data persistence, Firebase for authentication token verification, and Stripe for payment processing. The system solves issues like appointment scheduling, decorator assignment, on-site coordination, real-time status updates, and business analytics.

## Live URL
[https://decoration-booking-system.vercel.app/](https://decoration-booking-system-server.vercel.app/)  
*(Replace with the actual deployed server URL, e.g., on Vercel, Render, or Heroku)*

## Key Features
- **API Endpoints**: RESTful APIs for managing users, services, bookings, decorators, payments, and service categories.
  - **Users**: Create users on registration, get user role, list all users (admin-only).
  - **Services**: Fetch services with search (by name), filter (by category, budget range), limit; get single service; CRUD operations (admin-only).
  - **Bookings**: Create bookings, fetch user or decorator bookings, update status (decorator-only), delete booking (user-only), assign decorator (admin-only).
  - **Decorators**: Fetch decorators (all, by email, top-rated), create decorator profile, approve/reject decorators (admin-only, updates user role).
  - **Payments**: Create Stripe payment intent, handle payment success (update booking and store transaction), fetch user payment history.
  - **Service Categories**: Fetch all categories.
- **Authentication & Authorization**: Firebase token verification middleware; role-based access with admin and decorator verification middlewares using JWT-like token decoding.
- **Database Integration**: MongoDB collections for users, services, bookings, payments, decorators, and service categories. Supports fields like service_name, cost, category, description, createdByEmail for services; status flows for bookings (e.g., Pending, Assigned, Planning Phase, etc.).
- **Payment Processing**: Stripe for creating checkout sessions, handling success callbacks, and storing transactions with metadata linking to bookings.
- **On-Site Service Workflow**: APIs for assigning decorators to paid bookings and updating project statuses step-by-step.
- **Analytics**: Basic support for revenue monitoring via payments; potential for service demand queries (e.g., histogram via aggregated bookings).
- **Additional Features**: CORS enabled, environment variables for secrets (MongoDB creds, Stripe key, Firebase service account), error handling for unauthorized/forbidden access, date tracking for creations/updates.
- **Challenge Features**: Search and filtering in services API; sorting/limiting in queries; token verification in protected routes; basic pagination via limit.

## NPM Packages Used
The server uses the following NPM packages, inferred from the code. Dependencies are for runtime, while devDependencies are typical for development.

### Dependencies
- `express`: Web framework for Node.js APIs.
- `cors`: Middleware for enabling CORS.
- `dotenv`: For loading environment variables.
- `stripe`: Payment processing integration.
- `mongodb`: Official MongoDB driver for database interactions.
- `firebase-admin`: For verifying Firebase authentication tokens.

### DevDependencies
- `nodemon`: Tool for auto-restarting the server during development (assumed for dev workflow).

*Note: Install via `npm install`. Exact versions can be found in `package.json`. A service account JSON file is required for Firebase Admin.*

## Installation
1. Clone the repository: `git clone <your-server-repo-url>`
2. Navigate to the project directory: `cd decoration-booking-system-server`
3. Install dependencies: `npm install`
4. Create a `.env` file in the root with variables: `DB_USER`, `DB_PASSWORD`, `STRIPE_KEY`, `PORT`, `SITE_DOMAIN`.
5. Place the Firebase service account JSON (e.g., `decoration-booking-system-5-firebase-adminsdk-fbsvc-7bd68140dc.json`) in the root.
6. Run the development server: `npm run dev` (using nodemon) or `node index.js`

## Usage
- The server exposes API endpoints for the client (e.g., POST /users for registration, GET /services for listing services).
- Use tools like Postman to test endpoints, including authentication headers with Firebase tokens.
- Ensure MongoDB cluster is accessible and Firebase project is set up for token verification.
- Admin routes require admin role; decorator routes require decorator role.
- For payments, use Stripe test keys and monitor console logs for debugging.

## Deployment
- Deployed on Vercel (or similar serverless platform) for Node.js apps.
- Set environment variables in the deployment dashboard.
- Ensure no CORS/404/504 errors; add deployed domain to Firebase authorized domains if needed.
- MongoDB connection uses Atlas URI for cloud hosting.

## Contributing
This project is for evaluation. Fork for personal use if needed.

