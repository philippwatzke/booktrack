import { Request, Response } from 'express';
import prisma from '../utils/db.js';
import { CreateNoteInput, UpdateNoteInput } from '../types/index.js';

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { bookId } = req.params;

    // Verify book belongs to user
    const book = await prisma.book.findFirst({
      where: { id: bookId, userId },
    });

    if (!book) {
      res.status(404).json({
        success: false,
        error: 'Buch nicht gefunden',
      });
      return;
    }

    const notes = await prisma.note.findMany({
      where: { bookId, userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      error: 'Notizen konnten nicht geladen werden',
    });
  }
};

export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const noteData = req.body as CreateNoteInput;

    // Verify book belongs to user
    const book = await prisma.book.findFirst({
      where: { id: noteData.bookId, userId },
    });

    if (!book) {
      res.status(404).json({
        success: false,
        error: 'Buch nicht gefunden',
      });
      return;
    }

    const note = await prisma.note.create({
      data: {
        ...noteData,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      data: note,
      message: 'Notiz erfolgreich gespeichert',
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      error: 'Notiz konnte nicht erstellt werden',
    });
  }
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const updateData = req.body as UpdateNoteInput;

    // Check if note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: { id, userId },
    });

    if (!existingNote) {
      res.status(404).json({
        success: false,
        error: 'Notiz nicht gefunden',
      });
      return;
    }

    const note = await prisma.note.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: note,
      message: 'Notiz erfolgreich aktualisiert',
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      error: 'Notiz konnte nicht aktualisiert werden',
    });
  }
};

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Check if note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: { id, userId },
    });

    if (!existingNote) {
      res.status(404).json({
        success: false,
        error: 'Notiz nicht gefunden',
      });
      return;
    }

    await prisma.note.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Notiz erfolgreich gelöscht',
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      error: 'Notiz konnte nicht gelöscht werden',
    });
  }
};
