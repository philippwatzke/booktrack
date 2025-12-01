import { Request, Response } from 'express';
import prisma from '../utils/db.js';

// Get user preferences
export const getPreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    let preferences = await prisma.userPreferences.findUnique({
      where: { userId },
    });

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: { userId },
      });
    }

    res.status(200).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Einstellungen konnten nicht geladen werden',
    });
  }
};

// Update user preferences
export const updatePreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const data = req.body;

    const preferences = await prisma.userPreferences.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });

    res.status(200).json({
      success: true,
      data: preferences,
      message: 'Einstellungen erfolgreich gespeichert',
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Einstellungen konnten nicht gespeichert werden',
    });
  }
};

// Get all reading goals
export const getGoals = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const goals = await prisma.readingGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({
      success: false,
      error: 'Ziele konnten nicht geladen werden',
    });
  }
};

// Create reading goal
export const createGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { type, target, metric, deadline } = req.body;

    const goal = await prisma.readingGoal.create({
      data: {
        userId,
        type,
        target,
        metric,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    res.status(201).json({
      success: true,
      data: goal,
      message: 'Ziel erfolgreich erstellt',
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({
      success: false,
      error: 'Ziel konnte nicht erstellt werden',
    });
  }
};

// Update reading goal
export const updateGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data = req.body;

    // Check if goal belongs to user
    const existingGoal = await prisma.readingGoal.findFirst({
      where: { id, userId },
    });

    if (!existingGoal) {
      res.status(404).json({
        success: false,
        error: 'Ziel nicht gefunden',
      });
      return;
    }

    const goal = await prisma.readingGoal.update({
      where: { id },
      data,
    });

    res.status(200).json({
      success: true,
      data: goal,
      message: 'Ziel erfolgreich aktualisiert',
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({
      success: false,
      error: 'Ziel konnte nicht aktualisiert werden',
    });
  }
};

// Delete reading goal
export const deleteGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Check if goal belongs to user
    const existingGoal = await prisma.readingGoal.findFirst({
      where: { id, userId },
    });

    if (!existingGoal) {
      res.status(404).json({
        success: false,
        error: 'Ziel nicht gefunden',
      });
      return;
    }

    await prisma.readingGoal.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Ziel erfolgreich gelöscht',
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({
      success: false,
      error: 'Ziel konnte nicht gelöscht werden',
    });
  }
};

// Update goal progress (called automatically when reading sessions are created)
export const updateGoalProgress = async (userId: string): Promise<void> => {
  try {
    const goals = await prisma.readingGoal.findMany({
      where: { userId, completed: false },
    });

    for (const goal of goals) {
      let current = 0;

      if (goal.metric === 'BOOKS') {
        // Count finished books
        const finishedBooks = await prisma.book.count({
          where: {
            userId,
            status: 'FINISHED',
            updatedAt: {
              gte: goal.createdAt,
            },
          },
        });
        current = finishedBooks;
      } else if (goal.metric === 'PAGES') {
        // Sum pages from reading sessions
        const sessions = await prisma.readingSession.findMany({
          where: {
            userId,
            createdAt: {
              gte: goal.createdAt,
            },
          },
        });
        current = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
      } else if (goal.metric === 'MINUTES') {
        // Sum duration from reading sessions
        const sessions = await prisma.readingSession.findMany({
          where: {
            userId,
            createdAt: {
              gte: goal.createdAt,
            },
          },
        });
        current = Math.floor(sessions.reduce((sum, s) => sum + s.duration, 0) / 60);
      }

      // Update goal progress
      await prisma.readingGoal.update({
        where: { id: goal.id },
        data: {
          current,
          completed: current >= goal.target,
        },
      });
    }
  } catch (error) {
    console.error('Update goal progress error:', error);
  }
};
