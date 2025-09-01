import { Router } from 'express';
import { createNote, getNotes, getNoteById, updateNote, deleteNote } from '../controllers/noteController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Create a new note
router.post('/', createNote);

// Get all notes for the authenticated user
router.get('/', getNotes);

// Get a specific note by ID
router.get('/:id', getNoteById);

// Update a specific note by ID
router.put('/:id', updateNote);

// Delete a specific note by ID
router.delete('/:id', deleteNote);

export default router;
