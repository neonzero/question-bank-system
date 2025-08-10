// backend/src/app.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import questionRoutes from './routes/questionRoutes';
// ... other imports

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string).then(() => console.log('MongoDB connected'));

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
// ... other routes

export default app;
