import { Router } from 'express';
import {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  addBookToCollection,
  removeBookFromCollection,
  updateBookInCollection,
} from '../controllers/collectionsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getAllCollections);
router.get('/:id', getCollectionById);
router.post('/', createCollection);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);

// Book operations in collections
router.post('/:collectionId/books', addBookToCollection);
router.delete('/:collectionId/books/:bookId', removeBookFromCollection);
router.put('/:collectionId/books/:bookId', updateBookInCollection);

export default router;
