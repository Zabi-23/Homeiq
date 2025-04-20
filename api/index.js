//api/index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.rout.js';
import authRoute from './routes/auth.route.js';

const app = express();
dotenv.config();

mongoose.connect(process.env.Mongo)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


app.listen(3000, () => {
    console.log('Server is running on port 3000 ');
    });


app.use (express.json());
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);

