import { Router } from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { CreateNoteSchema, UpdateNoteSchema } from '../types/index.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/book/:bookId', getNotes);
router.post('/', validate(CreateNoteSchema), createNote);
router.put('/:id', validate(UpdateNoteSchema), updateNote);
router.delete('/:id', deleteNote);

export default router;
