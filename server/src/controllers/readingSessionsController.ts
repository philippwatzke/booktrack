import { Request, Response } from 'express';
import prisma from '../utils/db.js';
import { CreateReadingSessionInput, UpdateReadingSessionInput } from '../types/index.js';
import { updateStreakAfterReading } from './streaksController.js';
import { updateGoalProgress } from './goalsController.js';

export const getReadingSessions = async (req: Request, res: Response): Promise<void> => {
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

    const sessions = await prisma.readingSession.findMany({
      where: { bookId, userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error('Get reading sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Lese-Sessions konnten nicht geladen werden',
    });
  }
};

export const createReadingSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const sessionData = req.body as CreateReadingSessionInput;

    // Verify book belongs to user
    const book = await prisma.book.findFirst({
      where: { id: sessionData.bookId, userId },
    });

    if (!book) {
      res.status(404).json({
        success: false,
        error: 'Buch nicht gefunden',
      });
      return;
    }

    const session = await prisma.readingSession.create({
      data: {
        ...sessionData,
        userId,
      },
    });

    // Update streak after creating reading session
    await updateStreakAfterReading(
      userId,
      sessionData.bookId,
      sessionData.duration,
      sessionData.pagesRead
    );

    // Update goal progress
    await updateGoalProgress(userId);

    res.status(201).json({
      success: true,
      data: session,
      message: 'Lese-Session erfolgreich gespeichert',
    });
  } catch (error) {
    console.error('Create reading session error:', error);
    res.status(500).json({
      success: false,
      error: 'Lese-Session konnte nicht erstellt werden',
    });
  }
};

export const updateReadingSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const updateData = req.body as UpdateReadingSessionInput;

    // Check if session exists and belongs to user
    const existingSession = await prisma.readingSession.findFirst({
      where: { id, userId },
      include: { book: true },
    });

    if (!existingSession) {
      res.status(404).json({
        success: false,
        error: 'Lese-Session nicht gefunden',
      });
      return;
    }

    const session = await prisma.readingSession.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: session,
      message: 'Lese-Session erfolgreich aktualisiert',
    });
  } catch (error) {
    console.error('Update reading session error:', error);
    res.status(500).json({
      success: false,
      error: 'Lese-Session konnte nicht aktualisiert werden',
    });
  }
};

export const deleteReadingSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Check if session exists and belongs to user
    const existingSession = await prisma.readingSession.findFirst({
      where: { id, userId },
    });

    if (!existingSession) {
      res.status(404).json({
        success: false,
        error: 'Lese-Session nicht gefunden',
      });
      return;
    }

    await prisma.readingSession.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Lese-Session erfolgreich gelöscht',
    });
  } catch (error) {
    console.error('Delete reading session error:', error);
    res.status(500).json({
      success: false,
      error: 'Lese-Session konnte nicht gelöscht werden',
    });
  }
};

export const getReadingStats = async (req: Request, res: Response): Promise<void> => {
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

    // Get all reading sessions for this book
    const sessions = await prisma.readingSession.findMany({
      where: { bookId, userId },
      orderBy: { createdAt: 'desc' },
    });

    if (sessions.length === 0) {
      res.status(200).json({
        success: true,
        data: {
          pagesPerHour: 0,
          averageSessionDuration: 0,
          totalReadingTime: 0,
          totalPagesRead: 0,
          estimatedTimeToFinish: null,
        },
      });
      return;
    }

    // Calculate stats
    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0); // in seconds
    const totalPages = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
    const averageSessionDuration = totalDuration / sessions.length;

    // Calculate pages per hour
    const hoursRead = totalDuration / 3600;
    const pagesPerHour = hoursRead > 0 ? Math.round(totalPages / hoursRead) : 0;

    // Calculate estimated time to finish (in minutes)
    let estimatedTimeToFinish = null;
    if (book.pageCount && book.currentPage && pagesPerHour > 0) {
      const pagesRemaining = book.pageCount - book.currentPage;
      const hoursRemaining = pagesRemaining / pagesPerHour;
      estimatedTimeToFinish = Math.round(hoursRemaining * 60); // convert to minutes
    }

    res.status(200).json({
      success: true,
      data: {
        pagesPerHour,
        averageSessionDuration: Math.round(averageSessionDuration), // in seconds
        totalReadingTime: totalDuration,
        totalPagesRead: totalPages,
        estimatedTimeToFinish,
      },
    });
  } catch (error) {
    console.error('Get reading stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Lese-Statistiken konnten nicht geladen werden',
    });
  }
};
