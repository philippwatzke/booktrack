import { Request, Response } from 'express';
import prisma from '../utils/db.js';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    // Get recent activity (last 10 items)
    const recentSessions = await prisma.readingSession.findMany({
      where: { userId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentNotes = await prisma.note.findMany({
      where: { userId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentQuotes = await prisma.quote.findMany({
      where: { userId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Merge and sort by createdAt
    const recentActivity = [
      ...recentSessions.map((s) => ({ ...s, type: 'session' as const })),
      ...recentNotes.map((n) => ({ ...n, type: 'note' as const })),
      ...recentQuotes.map((q) => ({ ...q, type: 'quote' as const })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    // Get reading patterns (all sessions)
    const allSessions = await prisma.readingSession.findMany({
      where: { userId },
      select: {
        timeOfDay: true,
        createdAt: true,
        duration: true,
        pagesRead: true,
      },
    });

    // Calculate time of day patterns
    const timeOfDayCount: Record<string, { count: number; totalPages: number; totalDuration: number }> = {};
    allSessions.forEach((session) => {
      if (session.timeOfDay) {
        if (!timeOfDayCount[session.timeOfDay]) {
          timeOfDayCount[session.timeOfDay] = { count: 0, totalPages: 0, totalDuration: 0 };
        }
        timeOfDayCount[session.timeOfDay].count += 1;
        timeOfDayCount[session.timeOfDay].totalPages += session.pagesRead;
        timeOfDayCount[session.timeOfDay].totalDuration += session.duration;
      }
    });

    // Find best time of day (most sessions)
    let bestTimeOfDay = null;
    let maxCount = 0;
    Object.entries(timeOfDayCount).forEach(([time, data]) => {
      if (data.count > maxCount) {
        maxCount = data.count;
        bestTimeOfDay = time;
      }
    });

    // Calculate weekday patterns
    const weekdayCount: Record<number, { count: number; totalPages: number; totalDuration: number }> = {};
    allSessions.forEach((session) => {
      const weekday = new Date(session.createdAt).getDay(); // 0 = Sunday, 6 = Saturday
      if (!weekdayCount[weekday]) {
        weekdayCount[weekday] = { count: 0, totalPages: 0, totalDuration: 0 };
      }
      weekdayCount[weekday].count += 1;
      weekdayCount[weekday].totalPages += session.pagesRead;
      weekdayCount[weekday].totalDuration += session.duration;
    });

    // Find favorite weekday (most sessions)
    let favoriteWeekday = null;
    let maxWeekdayCount = 0;
    Object.entries(weekdayCount).forEach(([day, data]) => {
      if (data.count > maxWeekdayCount) {
        maxWeekdayCount = data.count;
        favoriteWeekday = parseInt(day);
      }
    });

    // Predictive reading (sessions in current year)
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59);

    const booksFinishedThisYear = await prisma.book.count({
      where: {
        userId,
        status: 'FINISHED',
        updatedAt: {
          gte: yearStart,
          lte: yearEnd,
        },
      },
    });

    // Calculate days elapsed in year
    const now = new Date();
    const daysElapsed = Math.floor((now.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysInYear = 365;
    const daysRemaining = daysInYear - daysElapsed;

    // Calculate projection
    let projectedBooksThisYear = booksFinishedThisYear;
    if (daysElapsed > 0) {
      const booksPerDay = booksFinishedThisYear / daysElapsed;
      projectedBooksThisYear = Math.round(booksFinishedThisYear + booksPerDay * daysRemaining);
    }

    // Monthly report (current month)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const monthSessions = await prisma.readingSession.findMany({
      where: {
        userId,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    const monthBooksFinished = await prisma.book.count({
      where: {
        userId,
        status: 'FINISHED',
        updatedAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    const monthTotalDuration = monthSessions.reduce((sum, s) => sum + s.duration, 0);
    const monthTotalPages = monthSessions.reduce((sum, s) => sum + s.pagesRead, 0);
    const monthTotalSessions = monthSessions.length;

    res.status(200).json({
      success: true,
      data: {
        recentActivity,
        readingPatterns: {
          timeOfDay: timeOfDayCount,
          weekdays: weekdayCount,
          bestTimeOfDay,
          favoriteWeekday,
        },
        predictiveReading: {
          booksFinishedThisYear,
          projectedBooksThisYear,
          daysElapsed,
          daysRemaining,
        },
        monthlyReport: {
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          totalSessions: monthTotalSessions,
          totalDuration: monthTotalDuration,
          totalPages: monthTotalPages,
          booksFinished: monthBooksFinished,
        },
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Dashboard-Statistiken konnten nicht geladen werden',
    });
  }
};
