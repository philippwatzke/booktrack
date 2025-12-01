import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { RegisterSchema, LoginSchema } from '../types/index.js';

const router = Router();

router.post('/register', validate(RegisterSchema), register);
router.post('/login', validate(LoginSchema), login);
router.get('/profile', authenticate, getProfile);

export default router;
