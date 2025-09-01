# Note-Taking App Backend

This is the backend for the Note-Taking App, built with Node.js, TypeScript, Express, and MongoDB. It provides RESTful APIs for authentication (email/OTP, Google OAuth), note management, and user management.

## Features
- User registration with email and OTP verification
- Login with email and password
- Google OAuth login
- JWT-based authentication
- Create, read, and delete notes
- Secure password hashing
- Email sending via Gmail (App Password)

## Prerequisites
- Node.js (v18 or higher recommended)
- npm
- MongoDB database (local or Atlas)

## Setup Instructions

1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd backend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in your MongoDB URI, Gmail credentials, JWT secret, Google OAuth credentials, etc.

4. **Run in development mode**
   ```sh
   npm run dev
   ```
   This uses `ts-node-dev` to run the TypeScript source with hot reload.

5. **Build and run in production**
   ```sh
   npm run build
   npm start
   ```

## API Endpoints

- `POST /api/auth/signup` — Register with email, receive OTP
- `POST /api/auth/verify-otp` — Verify OTP and set password
- `POST /api/auth/login` — Login with email and password
- `GET /api/auth/google` — Start Google OAuth
- `GET /api/auth/google/callback` — Google OAuth callback
- `GET /api/notes` — Get all notes (auth required)
- `POST /api/notes` — Create a note (auth required)
- `DELETE /api/notes/:id` — Delete a note (auth required)

## Environment Variables
See `.env.example` for all required variables:
- `MONGO_URI` — MongoDB connection string
- `GMAIL_USER` and `GMAIL_PASS` — Gmail App Password for sending OTPs
- `JWT_SECRET` — Secret for JWT signing
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` — Google OAuth
- `FRONTEND_URL` — URL for frontend (for OAuth redirect)
- `SESSION_SECRET` — Express session secret

## License
MIT
