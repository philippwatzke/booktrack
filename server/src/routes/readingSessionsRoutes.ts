import { Router } from 'express';
import {
  getReadingSessions,
  createReadingSession,
  updateReadingSession,
  deleteReadingSession,
  getReadingStats,
} from '../controllers/readingSessionsController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { CreateReadingSessionSchema, UpdateReadingSessionSchema } from '../types/index.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/book/:bookId', getReadingSessions);
router.get('/book/:bookId/stats', getReadingStats);
router.post('/', validate(CreateReadingSessionSchema), createReadingSession);
router.put('/:id', validate(UpdateReadingSessionSchema), updateReadingSession);
router.delete('/:id', deleteReadingSession);

export default router;
