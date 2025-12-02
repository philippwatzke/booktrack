import { Router } from 'express';
import {
  getAllSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
  addBookToSeries,
  removeBookFromSeries,
  updateBookInSeries,
  getUserSeries,
} from '../controllers/seriesController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getAllSeries);
router.get('/:id', getSeriesById);

// Authenticated routes
router.use(authenticate);

router.get('/user/my-series', getUserSeries);
router.post('/', createSeries);
router.put('/:id', updateSeries);
router.delete('/:id', deleteSeries);

// Book operations in series
router.post('/:seriesId/books', addBookToSeries);
router.delete('/:seriesId/books/:bookId', removeBookFromSeries);
router.put('/:seriesId/books/:bookId', updateBookInSeries);

export default router;
