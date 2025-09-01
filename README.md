# OTP Authentication System

A full-stack web application featuring OTP-based authentication with Google OAuth integration. Built with React TypeScript frontend and Node.js Express backend.

## 🚀 Features

- **OTP Authentication**: Email-based One-Time Password verification
- **Google OAuth**: Seamless Google account integration
- **Passwordless Login**: No password required - secure OTP-only flow
- **User Registration**: Name, Email, and Date of Birth collection
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Protected Routes**: JWT-based route protection
- **Email Integration**: Automated OTP delivery via email
- **Keep-Alive System**: Automated server keep-alive for free hosting (Render)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Nodemailer** for email delivery
- **Passport.js** for Google OAuth

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** database (local or cloud)
- **Gmail account** for email service
- **Google OAuth credentials** (for Google sign-in)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd assignment
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the `backend` directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/otp-auth-db
# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (Gmail)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-specific-password

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:5174
```

#### Required Environment Variables Explained:

1. **MONGODB_URI**: Your MongoDB connection string
   - Local: `mongodb://localhost:27017/your-database-name`
   - Atlas: Get from MongoDB Atlas dashboard

2. **JWT_SECRET**: A secure random string for signing JWT tokens
   - Generate one: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

3. **EMAIL_USER & EMAIL_PASS**: Gmail credentials for sending OTP emails
   - Use Gmail App Password (not your regular password)
   - Enable 2FA and generate App Password in Google Account settings

4. **Google OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:5000/api/auth/google/callback` as redirect URI

#### Start Backend Server
```bash
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

#### Navigate to Frontend Directory (in new terminal)
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5174`

## 🚀 Running the Application

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Open Browser**: Navigate to `http://localhost:5174`

## 📱 Usage

### Sign Up Flow
1. Enter your **Name**, **Email**, and **Date of Birth**
2. Click **"Get OTP"**
3. Check your email for the 6-digit OTP code
4. Enter the OTP in the field that appears
5. Click **"Sign up"** to complete registration

### Sign In Flow
1. Enter your **Email**
2. Click **"Get OTP"**
3. Check your email for the 6-digit OTP code
4. Enter the OTP in the field that appears
5. Click **"Sign in"** to access your account

### Google OAuth
- Click **"Continue with Google"** on either sign-up or sign-in page
- Complete Google authentication
- Automatically redirected to dashboard

## 🏗️ Build for Production

### Backend Production Build
```bash
cd backend
npm run build
npm start
```

### Frontend Production Build
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
assignment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts          # MongoDB connection
│   │   │   └── passport.ts    # Google OAuth config
│   │   ├── controllers/
│   │   │   ├── authController.ts  # Authentication logic
│   │   │   └── noteController.ts  # Notes management
│   │   ├── models/
│   │   │   ├── User.ts        # User schema
│   │   │   └── Note.ts        # Note schema
│   │   ├── routes/
│   │   │   ├── auth.ts        # Auth routes
│   │   │   ├── google.ts      # Google OAuth routes
│   │   │   └── notes.ts       # Notes routes
│   │   ├── utils/
│   │   │   └── mailer.ts      # Email service
│   │   └── index.ts           # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api.ts         # API client
│   │   │   ├── authApi.ts     # Auth API functions
│   │   │   └── utils.ts       # Utility functions
│   │   ├── pages/
│   │   │   ├── sign-up.tsx    # Registration page
│   │   │   ├── sign-in.tsx    # Login page
│   │   │   ├── DashboardDesktop.tsx
│   │   │   └── DashboardMobile.tsx
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **OTP Expiration**: OTP codes expire after 10 minutes
- **Email Validation**: Server-side email format validation
- **Input Sanitization**: All inputs are validated and sanitized
- **CORS Protection**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored in environment variables

## 🌐 API Endpoints

### Health & Monitoring Routes (`/api`)
- `GET /health` - Server health check (used by keep-alive system)
- `GET /ping` - Simple ping endpoint

### Authentication Routes (`/api/auth`)
- `POST /signup` - Request OTP for registration
- `POST /verify-signup` - Verify OTP and complete registration
- `POST /login` - Request OTP for login
- `POST /verify-login` - Verify OTP and login
- `POST /resend-otp` - Resend OTP code
- `GET /profile` - Get user profile (protected)

### Google OAuth Routes (`/api/auth`)
- `GET /google` - Initiate Google OAuth
- `GET /google/callback` - Google OAuth callback

### Notes Routes (`/api/notes`)
- `GET /` - Get user notes (protected)
- `POST /` - Create new note (protected)
- `PUT /:id` - Update note (protected)
- `DELETE /:id` - Delete note (protected)

## 🔄 Keep-Alive System (For Free Hosting)

This project includes a comprehensive keep-alive system to prevent free tier hosting services (like Render) from spinning down due to inactivity.

### Built-in Keep-Alive (Automatic)
- **Internal Cron Job**: Automatically pings the server every 5 minutes when deployed on Render
- **Health Endpoint**: `/api/health` provides server status and uptime information
- **Production Only**: Keep-alive only runs in production environment with `RENDER=true`

### External Keep-Alive Options

#### 1. Manual Script
```bash
# Set your deployed URL
export RENDER_URL=https://your-app.onrender.com

# Run the keep-alive script
npm run keepalive
```

#### 2. External Cron Services
Use services like **cron-job.org** or **EasyCron**:
- **URL to ping**: `https://your-app.onrender.com/api/health`
- **Interval**: Every 5-10 minutes
- **Method**: GET
- **User-Agent**: `External-KeepAlive`

#### 3. GitHub Actions (Automated)
The project includes a GitHub Actions workflow that automatically pings your server:
- **File**: `.github/workflows/keepalive.yml`
- **Schedule**: Every 5 minutes during active hours (6 AM - 11 PM UTC)
- **Setup**: Add your Render URL to GitHub Secrets as `RENDER_URL`

### Keep-Alive Configuration
```env
# In your .env file (automatically set by Render)
RENDER_EXTERNAL_URL=https://your-app.onrender.com
RENDER=true
NODE_ENV=production
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally
   - Check MONGODB_URI in .env file
   - For Atlas: Whitelist your IP address

2. **Email Not Sending**
   - Verify EMAIL_USER and EMAIL_PASS
   - Use Gmail App Password, not regular password
   - Enable 2FA on Gmail account

3. **Google OAuth Not Working**
   - Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
   - Verify redirect URI in Google Cloud Console
   - Ensure Google+ API is enabled

4. **CORS Errors**
   - Check FRONTEND_URL in backend .env
   - Ensure both servers are running on correct ports

5. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

## 📝 Development Scripts

### Backend Scripts
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm run lint     # Run ESLint
```

### Frontend Scripts
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🚀 Deployment

### Deploying to Render (Free Tier)

1. **Push to GitHub**: Ensure your code is pushed to a GitHub repository

2. **Create Render Account**: Sign up at [render.com](https://render.com)

3. **Create New Web Service**:
   - Connect your GitHub repository
   - Choose the backend directory: `backend`
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`
   - Choose free tier

4. **Environment Variables**: Add these in Render dashboard:
   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-gmail-app-password
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   SESSION_SECRET=your-session-secret
   ```

5. **Domain Setup**: Render provides a free domain like `https://your-app.onrender.com`

6. **Keep-Alive Setup**: The internal cron job will automatically start on deployment

### Frontend Deployment (Netlify/Vercel)

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy dist folder** to Netlify, Vercel, or any static hosting

3. **Update environment**: Set `VITE_API_URL` to your Render backend URL

### Health Check
After deployment, verify the keep-alive system:
```bash
curl https://your-app.onrender.com/api/health

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 💡 Tips

- **Development**: Use `npm run dev` for both frontend and backend during development
- **Production**: Build both projects and use a process manager like PM2
- **Database**: MongoDB Compass is helpful for database visualization
- **Email Testing**: Use a test email service in development
- **Environment**: Keep production environment variables secure

---

For additional help or questions, please open an issue in the repository.
