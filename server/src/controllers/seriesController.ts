import { Request, Response } from 'express';
import prisma from '../utils/db.js';

// Get all series
export const getAllSeries = async (req: Request, res: Response): Promise<void> => {
  try {
    const series = await prisma.series.findMany({
      include: {
        books: {
          include: {
            book: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Calculate progress for each series
    const seriesWithProgress = series.map((s) => ({
      ...s,
      progress: {
        total: s.totalBooks || s.books.length,
        collected: s.books.length,
        percentage:
          s.totalBooks || s.books.length
            ? Math.round((s.books.length / (s.totalBooks || s.books.length)) * 100)
            : 0,
      },
    }));

    res.status(200).json({
      success: true,
      data: seriesWithProgress,
    });
  } catch (error) {
    console.error('Get series error:', error);
    res.status(500).json({
      success: false,
      error: 'Reihen konnten nicht geladen werden',
    });
  }
};

// Get a single series by ID
export const getSeriesById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const series = await prisma.series.findUnique({
      where: { id },
      include: {
        books: {
          include: {
            book: {
              include: {
                readingSessions: true,
                quotes: true,
                notes: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!series) {
      res.status(404).json({
        success: false,
        error: 'Reihe nicht gefunden',
      });
      return;
    }

    // Calculate progress
    const seriesWithProgress = {
      ...series,
      progress: {
        total: series.totalBooks || series.books.length,
        collected: series.books.length,
        percentage:
          series.totalBooks || series.books.length
            ? Math.round((series.books.length / (series.totalBooks || series.books.length)) * 100)
            : 0,
      },
    };

    res.status(200).json({
      success: true,
      data: seriesWithProgress,
    });
  } catch (error) {
    console.error('Get series error:', error);
    res.status(500).json({
      success: false,
      error: 'Reihe konnte nicht geladen werden',
    });
  }
};

// Create a new series
export const createSeries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, author, totalBooks } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        error: 'Name ist erforderlich',
      });
      return;
    }

    const series = await prisma.series.create({
      data: {
        name,
        author,
        totalBooks,
      },
      include: {
        books: {
          include: {
            book: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: series,
      message: 'Reihe erfolgreich erstellt',
    });
  } catch (error) {
    console.error('Create series error:', error);
    res.status(500).json({
      success: false,
      error: 'Reihe konnte nicht erstellt werden',
    });
  }
};

// Update a series
export const updateSeries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, author, totalBooks } = req.body;

    const existingSeries = await prisma.series.findUnique({
      where: { id },
    });

    if (!existingSeries) {
      res.status(404).json({
        success: false,
        error: 'Reihe nicht gefunden',
      });
      return;
    }

    const series = await prisma.series.update({
      where: { id },
      data: {
        name,
        author,
        totalBooks,
      },
      include: {
        books: {
          include: {
            book: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: series,
      message: 'Reihe erfolgreich aktualisiert',
    });
  } catch (error) {
    console.error('Update series error:', error);
    res.status(500).json({
      success: false,
      error: 'Reihe konnte nicht aktualisiert werden',
    });
  }
};

// Delete a series
export const deleteSeries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingSeries = await prisma.series.findUnique({
      where: { id },
    });

    if (!existingSeries) {
      res.status(404).json({
        success: false,
        error: 'Reihe nicht gefunden',
      });
      return;
    }

    await prisma.series.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Reihe erfolgreich gelöscht',
    });
  } catch (error) {
    console.error('Delete series error:', error);
    res.status(500).json({
      success: false,
      error: 'Reihe konnte nicht gelöscht werden',
    });
  }
};

// Add a book to a series
export const addBookToSeries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { seriesId } = req.params;
    const { bookId, order } = req.body;

    if (!bookId || order === undefined) {
      res.status(400).json({
        success: false,
        error: 'Buch-ID und Reihenfolge sind erforderlich',
      });
      return;
    }

    // Check if series exists
    const series = await prisma.series.findUnique({
      where: { id: seriesId },
    });

    if (!series) {
      res.status(404).json({
        success: false,
        error: 'Reihe nicht gefunden',
      });
      return;
    }

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      res.status(404).json({
        success: false,
        error: 'Buch nicht gefunden',
      });
      return;
    }

    // Check if book is already in series
    const existing = await prisma.bookSeries.findFirst({
      where: { seriesId, bookId },
    });

    if (existing) {
      res.status(400).json({
        success: false,
        error: 'Buch ist bereits in dieser Reihe',
      });
      return;
    }

    const bookSeries = await prisma.bookSeries.create({
      data: {
        seriesId,
        bookId,
        order,
      },
      include: {
        book: true,
      },
    });

    res.status(201).json({
      success: true,
      data: bookSeries,
      message: 'Buch zur Reihe hinzugefügt',
    });
  } catch (error) {
    console.error('Add book to series error:', error);
    res.status(500).json({
      success: false,
      error: 'Buch konnte nicht zur Reihe hinzugefügt werden',
    });
  }
};

// Remove a book from a series
export const removeBookFromSeries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { seriesId, bookId } = req.params;

    // Check if series exists
    const series = await prisma.series.findUnique({
      where: { id: seriesId },
    });

    if (!series) {
      res.status(404).json({
        success: false,
        error: 'Reihe nicht gefunden',
      });
      return;
    }

    // Delete the book series relationship
    const deleted = await prisma.bookSeries.deleteMany({
      where: { seriesId, bookId },
    });

    if (deleted.count === 0) {
      res.status(404).json({
        success: false,
        error: 'Buch nicht in dieser Reihe gefunden',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Buch aus Reihe entfernt',
    });
  } catch (error) {
    console.error('Remove book from series error:', error);
    res.status(500).json({
      success: false,
      error: 'Buch konnte nicht aus Reihe entfernt werden',
    });
  }
};

// Update book order in series
export const updateBookInSeries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { seriesId, bookId } = req.params;
    const { order } = req.body;

    if (order === undefined) {
      res.status(400).json({
        success: false,
        error: 'Reihenfolge ist erforderlich',
      });
      return;
    }

    // Check if series exists
    const series = await prisma.series.findUnique({
      where: { id: seriesId },
    });

    if (!series) {
      res.status(404).json({
        success: false,
        error: 'Reihe nicht gefunden',
      });
      return;
    }

    // Update the book series
    const bookSeries = await prisma.bookSeries.updateMany({
      where: { seriesId, bookId },
      data: {
        order,
      },
    });

    if (bookSeries.count === 0) {
      res.status(404).json({
        success: false,
        error: 'Buch nicht in dieser Reihe gefunden',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Buch-Reihenfolge aktualisiert',
    });
  } catch (error) {
    console.error('Update book in series error:', error);
    res.status(500).json({
      success: false,
      error: 'Buch-Reihenfolge konnte nicht aktualisiert werden',
    });
  }
};

// Get user's series (books they own)
export const getUserSeries = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    // Get all series that have at least one book owned by the user
    const allSeries = await prisma.series.findMany({
      include: {
        books: {
          include: {
            book: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    // Filter to only include series where user owns at least one book
    const userSeries = allSeries
      .map((series) => {
        const ownedBooks = series.books.filter((bs) => bs.book.userId === userId);
        if (ownedBooks.length === 0) return null;

        return {
          ...series,
          books: ownedBooks,
          progress: {
            total: series.totalBooks || series.books.length,
            owned: ownedBooks.length,
            allBooks: series.books.length,
            percentage:
              series.totalBooks || series.books.length
                ? Math.round((ownedBooks.length / (series.totalBooks || series.books.length)) * 100)
                : 0,
          },
        };
      })
      .filter((s) => s !== null);

    res.status(200).json({
      success: true,
      data: userSeries,
    });
  } catch (error) {
    console.error('Get user series error:', error);
    res.status(500).json({
      success: false,
      error: 'Reihen konnten nicht geladen werden',
    });
  }
};
