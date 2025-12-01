import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse, StreakData, DailyLog, UseFreezeSchema } from '../types/index.js';

const prisma = new PrismaClient();

// Helper: Get today's date in YYYY-MM-DD format
function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Helper: Calculate days between two dates
function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Helper: Calculate streak from last read date
function calculateStreak(lastReadDate: Date | null): number {
  if (!lastReadDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastRead = new Date(lastReadDate);
  lastRead.setHours(0, 0, 0, 0);

  const days = daysBetween(lastRead, today);

  // If last read was today or yesterday, streak continues
  if (days <= 1) {
    return 1; // Streak is maintained, but actual count is stored in DB
  }

  // If more than 1 day, streak is broken
  return 0;
}

// GET /api/streaks - Get user's streak data
export async function getStreak(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    let streak = await prisma.readingStreak.findUnique({
      where: { userId },
    });

    // Create streak record if doesn't exist
    if (!streak) {
      streak = await prisma.readingStreak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
          freezeDaysUsed: 0,
        },
      });
    }

    // Calculate freeze days available (1 per month, max 3)
    const monthsSinceCreation = Math.floor(
      (Date.now() - new Date(streak.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const freezeDaysEarned = Math.min(monthsSinceCreation, 3);
    const freezeDaysAvailable = Math.max(0, freezeDaysEarned - streak.freezeDaysUsed);

    const response: ApiResponse<StreakData> = {
      success: true,
      data: {
        id: streak.id,
        userId: streak.userId,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastReadDate: streak.lastReadDate?.toISOString().split('T')[0] || null,
        freezeDaysUsed: streak.freezeDaysUsed,
        freezeDaysAvailable,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching streak:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Fehler beim Abrufen der Streak-Daten',
    };
    res.status(500).json(response);
  }
}

// GET /api/streaks/logs - Get daily reading logs for calendar
export async function getDailyLogs(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { startDate, endDate } = req.query;

    const where: any = { userId };

    if (startDate && endDate) {
      where.date = {
        gte: startDate as string,
        lte: endDate as string,
      };
    }

    const logs = await prisma.dailyReadingLog.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const formattedLogs: DailyLog[] = logs.map(log => ({
      id: log.id,
      userId: log.userId,
      date: log.date,
      duration: log.duration,
      pagesRead: log.pagesRead,
      booksRead: JSON.parse(log.booksRead),
    }));

    const response: ApiResponse<DailyLog[]> = {
      success: true,
      data: formattedLogs,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching daily logs:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Fehler beim Abrufen der Leselogs',
    };
    res.status(500).json(response);
  }
}

// POST /api/streaks/freeze - Use a freeze day
export async function useFreeze(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const validation = UseFreezeSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: validation.error.errors[0].message,
      };
      return res.status(400).json(response);
    }

    const { date } = validation.data;

    const streak = await prisma.readingStreak.findUnique({
      where: { userId },
    });

    if (!streak) {
      const response: ApiResponse = {
        success: false,
        error: 'Streak-Daten nicht gefunden',
      };
      return res.status(404).json(response);
    }

    // Calculate available freeze days
    const monthsSinceCreation = Math.floor(
      (Date.now() - new Date(streak.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const freezeDaysEarned = Math.min(monthsSinceCreation, 3);
    const freezeDaysAvailable = Math.max(0, freezeDaysEarned - streak.freezeDaysUsed);

    if (freezeDaysAvailable <= 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Keine Freeze-Tage verfügbar',
      };
      return res.status(400).json(response);
    }

    // Create a fake log entry for the frozen day
    await prisma.dailyReadingLog.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      update: {
        duration: 1, // Minimal activity to maintain streak
        pagesRead: 0,
        booksRead: JSON.stringify([]),
      },
      create: {
        userId,
        date,
        duration: 1,
        pagesRead: 0,
        booksRead: JSON.stringify([]),
      },
    });

    // Increment freeze days used
    const updated = await prisma.readingStreak.update({
      where: { userId },
      data: {
        freezeDaysUsed: streak.freezeDaysUsed + 1,
      },
    });

    const response: ApiResponse<StreakData> = {
      success: true,
      data: {
        id: updated.id,
        userId: updated.userId,
        currentStreak: updated.currentStreak,
        longestStreak: updated.longestStreak,
        lastReadDate: updated.lastReadDate?.toISOString().split('T')[0] || null,
        freezeDaysUsed: updated.freezeDaysUsed,
        freezeDaysAvailable: freezeDaysAvailable - 1,
      },
      message: 'Freeze-Tag erfolgreich verwendet',
    };

    res.json(response);
  } catch (error) {
    console.error('Error using freeze day:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Fehler beim Verwenden des Freeze-Tags',
    };
    res.status(500).json(response);
  }
}

// Internal function to update streak (called from reading session creation)
export async function updateStreakAfterReading(
  userId: string,
  bookId: string,
  duration: number,
  pagesRead: number
): Promise<void> {
  const today = getTodayString();

  // Update or create daily log
  const existingLog = await prisma.dailyReadingLog.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });

  if (existingLog) {
    const booksRead = JSON.parse(existingLog.booksRead) as string[];
    if (!booksRead.includes(bookId)) {
      booksRead.push(bookId);
    }

    await prisma.dailyReadingLog.update({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      data: {
        duration: existingLog.duration + duration,
        pagesRead: existingLog.pagesRead + pagesRead,
        booksRead: JSON.stringify(booksRead),
      },
    });
  } else {
    await prisma.dailyReadingLog.create({
      data: {
        userId,
        date: today,
        duration,
        pagesRead,
        booksRead: JSON.stringify([bookId]),
      },
    });
  }

  // Update streak
  let streak = await prisma.readingStreak.findUnique({
    where: { userId },
  });

  if (!streak) {
    streak = await prisma.readingStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastReadDate: new Date(today),
        freezeDaysUsed: 0,
      },
    });
    return;
  }

  const lastReadDate = streak.lastReadDate;
  const todayDate = new Date(today);
  todayDate.setHours(0, 0, 0, 0);

  let newStreak = streak.currentStreak;

  if (!lastReadDate) {
    // First read ever
    newStreak = 1;
  } else {
    const lastRead = new Date(lastReadDate);
    lastRead.setHours(0, 0, 0, 0);

    const daysSinceLastRead = daysBetween(lastRead, todayDate);

    if (daysSinceLastRead === 0) {
      // Reading again today, don't increment
      newStreak = streak.currentStreak;
    } else if (daysSinceLastRead === 1) {
      // Reading on consecutive day, increment
      newStreak = streak.currentStreak + 1;
    } else {
      // Gap in reading, reset streak
      newStreak = 1;
    }
  }

  const newLongestStreak = Math.max(newStreak, streak.longestStreak);

  await prisma.readingStreak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastReadDate: todayDate,
    },
  });
}
