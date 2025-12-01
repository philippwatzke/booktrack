import { Router } from 'express';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBookByIsbn,
  searchBooksExternal,
} from '../controllers/booksController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { CreateBookSchema, UpdateBookSchema } from '../types/index.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getAllBooks);
router.get('/search', searchBooksExternal); // Must be before /:id to avoid conflict
router.get('/isbn/:isbn', searchBookByIsbn);
router.get('/:id', getBookById);
router.post('/', validate(CreateBookSchema), createBook);
router.put('/:id', validate(UpdateBookSchema), updateBook);
router.delete('/:id', deleteBook);

export default router;
