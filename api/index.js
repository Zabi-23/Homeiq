// api/index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.rout.js';
import authRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

// Anslut till MongoDB
mongoose.connect(process.env.Mongo)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);

// Global error handler (MÅSTE ligga efter routes)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server (lägg sist!)
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
