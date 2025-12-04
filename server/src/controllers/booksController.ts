import { Request, Response } from 'express';
import prisma from '../utils/db.js';
import { CreateBookInput, UpdateBookInput } from '../types/index.js';
import { transformBookFromDb, transformBookForDb } from '../utils/helpers.js';
import { updateGoalProgress } from './goalsController.js';
import { searchBooks } from '../services/googleBooksService.js';

export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { status, search } = req.query;

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { author: { contains: search as string } },
      ];
    }

    const books = await prisma.book.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: books.map(transformBookFromDb),
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      error: 'Bücher konnten nicht geladen werden',
    });
  }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const book = await prisma.book.findFirst({
      where: { id, userId },
      include: {
        readingSessions: {
          orderBy: { createdAt: 'desc' },
        },
        quotes: {
          orderBy: { createdAt: 'desc' },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!book) {
      res.status(404).json({
        success: false,
        error: 'Buch nicht gefunden',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: transformBookFromDb(book),
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({
      success: false,
      error: 'Buch konnte nicht geladen werden',
    });
  }
};

export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const bookData = req.body as CreateBookInput;

    const book = await prisma.book.create({
      data: transformBookForDb({
        ...bookData,
        userId,
      }),
    });

    res.status(201).json({
      success: true,
      data: transformBookFromDb(book),
      message: 'Buch erfolgreich hinzugefügt',
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({
      success: false,
      error: 'Buch konnte nicht erstellt werden',
    });
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const updateData = req.body as UpdateBookInput;

    // Check if book exists and belongs to user
    const existingBook = await prisma.book.findFirst({
      where: { id, userId },
    });

    if (!existingBook) {
      res.status(404).json({
        success: false,
        error: 'Buch nicht gefunden',
      });
      return;
    }

    // Auto-update status to FINISHED if currentPage equals pageCount
    if (updateData.currentPage !== undefined &&
        existingBook.pageCount &&
        updateData.currentPage >= existingBook.pageCount &&
        existingBook.status !== 'FINISHED') {
      updateData.status = 'FINISHED';
      console.log(`📚 Auto-Status-Update: Book "${existingBook.title}" marked as FINISHED (${updateData.currentPage}/${existingBook.pageCount} pages)`);
    }

    const book = await prisma.book.update({
      where: { id },
      data: transformBookForDb(updateData),
    });

    // If book status changed to FINISHED or currentPage equals pageCount, update goals
    if (updateData.status === 'FINISHED' ||
        (updateData.currentPage && book.pageCount && updateData.currentPage >= book.pageCount)) {
      await updateGoalProgress(userId);
    }

    res.status(200).json({
      success: true,
      data: transformBookFromDb(book),
      message: 'Buch erfolgreich aktualisiert',
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({
      success: false,
      error: 'Buch konnte nicht aktualisiert werden',
    });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Check if book exists and belongs to user
    const existingBook = await prisma.book.findFirst({
      where: { id, userId },
    });

    if (!existingBook) {
      res.status(404).json({
        success: false,
        error: 'Buch nicht gefunden',
      });
      return;
    }

    await prisma.book.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Buch erfolgreich gelöscht',
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      error: 'Buch konnte nicht gelöscht werden',
    });
  }
};

export const searchBookByIsbn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isbn } = req.params;

    // TODO: Integrate with external ISBN API (OpenLibrary, Google Books, etc.)
    // For now, return mock data
    res.status(200).json({
      success: true,
      data: {
        isbn,
        title: 'Beispielbuch via ISBN',
        author: 'Max Mustermann',
        description: 'Eine faszinierende Geschichte über...',
        pageCount: 320,
        publishedYear: 2023,
        publisher: 'Beispielverlag',
        coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
      },
      message: 'Dies ist ein Mock-Ergebnis. ISBN-API-Integration steht noch aus.',
    });
  } catch (error) {
    console.error('ISBN search error:', error);
    res.status(500).json({
      success: false,
      error: 'ISBN-Suche fehlgeschlagen',
    });
  }
};

export const searchBooksExternal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Suchbegriff ist erforderlich',
      });
      return;
    }

    if (query.length < 2) {
      res.status(400).json({
        success: false,
        error: 'Suchbegriff muss mindestens 2 Zeichen lang sein',
      });
      return;
    }

    const results = await searchBooks(query, 10);

    res.status(200).json({
      success: true,
      data: results,
      message: `${results.length} Bücher gefunden`,
    });
  } catch (error: any) {
    console.error('Book search error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Buchsuche fehlgeschlagen',
    });
  }
};
