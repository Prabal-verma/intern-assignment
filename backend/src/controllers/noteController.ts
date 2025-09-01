import { Request, Response } from 'express';
import { Note } from '../models/Note';

interface AuthRequest extends Request {
  user?: any;
}

export const createNote = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  const userId = req.user._id;
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  
  if (title.trim().length === 0 || content.trim().length === 0) {
    return res.status(400).json({ message: 'Title and content cannot be empty' });
  }
  
  try {
    const note = await Note.create({ 
      user: userId, 
      title: title.trim(), 
      content: content.trim() 
    });
    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (err) {
    console.error('Create note error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  const userId = req.user._id;
  
  try {
    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
    res.json({
      message: 'Notes retrieved successfully',
      notes,
      count: notes.length
    });
  } catch (err) {
    console.error('Get notes error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const getNoteById = async (req: AuthRequest, res: Response) => {
  const userId = req.user._id;
  const { id } = req.params;
  
  try {
    const note = await Note.findOne({ _id: id, user: userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({
      message: 'Note retrieved successfully',
      note
    });
  } catch (err) {
    console.error('Get note by id error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  const userId = req.user._id;
  const { id } = req.params;
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  
  if (title.trim().length === 0 || content.trim().length === 0) {
    return res.status(400).json({ message: 'Title and content cannot be empty' });
  }
  
  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, user: userId },
      { title: title.trim(), content: content.trim() },
      { new: true }
    );
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json({
      message: 'Note updated successfully',
      note
    });
  } catch (err) {
    console.error('Update note error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  const userId = req.user._id;
  const { id } = req.params;
  
  try {
    const note = await Note.findOneAndDelete({ _id: id, user: userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ 
      message: 'Note deleted successfully',
      deletedNote: {
        id: note._id,
        title: note.title
      }
    });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
