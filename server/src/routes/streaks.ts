import express from 'express';
import { getStreak, getDailyLogs, useFreeze } from '../controllers/streaksController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All streak routes require authentication
router.use(authenticate);

// GET /api/streaks - Get user's streak data
router.get('/', getStreak);

// GET /api/streaks/logs - Get daily reading logs for calendar
router.get('/logs', getDailyLogs);

// POST /api/streaks/freeze - Use a freeze day
router.post('/freeze', useFreeze);

export default router;
