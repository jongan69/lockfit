import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'; // Ensure the path is correct
import connectDB from './config/db.js'; // Ensure the path is correct

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
