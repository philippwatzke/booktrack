import { Router } from 'express';
import {
  getQuotes,
  createQuote,
  updateQuote,
  deleteQuote,
} from '../controllers/quotesController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { CreateQuoteSchema, UpdateQuoteSchema } from '../types/index.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getQuotes);
router.get('/book/:bookId', getQuotes);
router.post('/', validate(CreateQuoteSchema), createQuote);
router.put('/:id', validate(UpdateQuoteSchema), updateQuote);
router.delete('/:id', deleteQuote);

export default router;
