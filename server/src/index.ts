import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import booksRoutes from './routes/booksRoutes.js';
import readingSessionsRoutes from './routes/readingSessionsRoutes.js';
import quotesRoutes from './routes/quotesRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import streaksRoutes from './routes/streaks.js';
import goalsRoutes from './routes/goals.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/reading-sessions', readingSessionsRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/streaks', streaksRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
});

export default app;
