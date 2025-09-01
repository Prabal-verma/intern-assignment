
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { startKeepAliveCron } from './cron/keepAlive';

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());



import authRoutes from './routes/auth';
import googleRoutes from './routes/google';
import notesRoutes from './routes/notes';
import healthRoutes from './routes/health';
import passport from 'passport';
import session from 'express-session';
import './config/passport';
app.use(session({
  secret: process.env.SESSION_SECRET || 'sessionsecret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api', healthRoutes);

app.get('/', (req, res) => {
  res.send('Note-taking API is running');
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Start the keep-alive cron job after server starts
    startKeepAliveCron();
  });
});
