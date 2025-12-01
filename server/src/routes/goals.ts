import { Router } from 'express';
import {
  getPreferences,
  updatePreferences,
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../controllers/goalsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Preferences routes
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);

// Goals routes
router.get('/', getGoals);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

export default router;
