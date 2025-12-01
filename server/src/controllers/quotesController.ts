import { Request, Response } from 'express';
import prisma from '../utils/db.js';
import { CreateQuoteInput, UpdateQuoteInput } from '../types/index.js';

export const getQuotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { bookId } = req.params;

    if (bookId) {
      // Get quotes for specific book
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

      const quotes = await prisma.quote.findMany({
        where: { bookId, userId },
        orderBy: { createdAt: 'desc' },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        data: quotes,
      });
    } else {
      // Get all quotes for user
      const quotes = await prisma.quote.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        data: quotes,
      });
    }
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({
      success: false,
      error: 'Zitate konnten nicht geladen werden',
    });
  }
};

export const createQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const quoteData = req.body as CreateQuoteInput;

    // Verify book belongs to user
    const book = await prisma.book.findFirst({
      where: { id: quoteData.bookId, userId },
    });

    if (!book) {
      res.status(404).json({
        success: false,
        error: 'Buch nicht gefunden',
      });
      return;
    }

    const quote = await prisma.quote.create({
      data: {
        ...quoteData,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      data: quote,
      message: 'Zitat erfolgreich gespeichert',
    });
  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({
      success: false,
      error: 'Zitat konnte nicht erstellt werden',
    });
  }
};

export const updateQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const updateData = req.body as UpdateQuoteInput;

    // Check if quote exists and belongs to user
    const existingQuote = await prisma.quote.findFirst({
      where: { id, userId },
    });

    if (!existingQuote) {
      res.status(404).json({
        success: false,
        error: 'Zitat nicht gefunden',
      });
      return;
    }

    const quote = await prisma.quote.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: quote,
      message: 'Zitat erfolgreich aktualisiert',
    });
  } catch (error) {
    console.error('Update quote error:', error);
    res.status(500).json({
      success: false,
      error: 'Zitat konnte nicht aktualisiert werden',
    });
  }
};

export const deleteQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Check if quote exists and belongs to user
    const existingQuote = await prisma.quote.findFirst({
      where: { id, userId },
    });

    if (!existingQuote) {
      res.status(404).json({
        success: false,
        error: 'Zitat nicht gefunden',
      });
      return;
    }

    await prisma.quote.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Zitat erfolgreich gelöscht',
    });
  } catch (error) {
    console.error('Delete quote error:', error);
    res.status(500).json({
      success: false,
      error: 'Zitat konnte nicht gelöscht werden',
    });
  }
};
