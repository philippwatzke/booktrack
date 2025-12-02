import { Request, Response } from 'express';
import prisma from '../utils/db.js';

// Get all collections for a user
export const getAllCollections = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { type } = req.query;

    const where: any = { userId };
    if (type) {
      where.type = type;
    }

    const collections = await prisma.collection.findMany({
      where,
      include: {
        books: {
          include: {
            book: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate progress for each collection
    const collectionsWithProgress = collections.map((collection) => {
      const totalBooks = collection.books.length;
      const collectedBooks = collection.books.filter(
        (bc) => bc.status === 'COLLECTED' || bc.status === 'DUPLICATE'
      ).length;
      const wishlistBooks = collection.books.filter((bc) => bc.status === 'WISHLIST').length;
      const missingBooks = collection.books.filter((bc) => bc.status === 'MISSING').length;

      return {
        ...collection,
        progress: {
          total: collection.targetCount || totalBooks,
          collected: collectedBooks,
          wishlist: wishlistBooks,
          missing: missingBooks,
          percentage:
            collection.targetCount || totalBooks
              ? Math.round((collectedBooks / (collection.targetCount || totalBooks)) * 100)
              : 0,
        },
      };
    });

    res.status(200).json({
      success: true,
      data: collectionsWithProgress,
    });
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({
      success: false,
      error: 'Kollektionen konnten nicht geladen werden',
    });
  }
};

// Get a single collection by ID
export const getCollectionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const collection = await prisma.collection.findFirst({
      where: { id, userId },
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

    if (!collection) {
      res.status(404).json({
        success: false,
        error: 'Kollektion nicht gefunden',
      });
      return;
    }

    // Calculate progress
    const totalBooks = collection.books.length;
    const collectedBooks = collection.books.filter(
      (bc) => bc.status === 'COLLECTED' || bc.status === 'DUPLICATE'
    ).length;
    const wishlistBooks = collection.books.filter((bc) => bc.status === 'WISHLIST').length;
    const missingBooks = collection.books.filter((bc) => bc.status === 'MISSING').length;

    const collectionWithProgress = {
      ...collection,
      progress: {
        total: collection.targetCount || totalBooks,
        collected: collectedBooks,
        wishlist: wishlistBooks,
        missing: missingBooks,
        percentage:
          collection.targetCount || totalBooks
            ? Math.round((collectedBooks / (collection.targetCount || totalBooks)) * 100)
            : 0,
      },
    };

    res.status(200).json({
      success: true,
      data: collectionWithProgress,
    });
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({
      success: false,
      error: 'Kollektion konnte nicht geladen werden',
    });
  }
};

// Create a new collection
export const createCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { type, name, description, targetCount } = req.body;

    if (!type || !name) {
      res.status(400).json({
        success: false,
        error: 'Typ und Name sind erforderlich',
      });
      return;
    }

    const collection = await prisma.collection.create({
      data: {
        userId,
        type,
        name,
        description,
        targetCount,
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
      data: collection,
      message: 'Kollektion erfolgreich erstellt',
    });
  } catch (error) {
    console.error('Create collection error:', error);
    res.status(500).json({
      success: false,
      error: 'Kollektion konnte nicht erstellt werden',
    });
  }
};

// Update a collection
export const updateCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { name, description, targetCount } = req.body;

    // Check if collection exists and belongs to user
    const existingCollection = await prisma.collection.findFirst({
      where: { id, userId },
    });

    if (!existingCollection) {
      res.status(404).json({
        success: false,
        error: 'Kollektion nicht gefunden',
      });
      return;
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        name,
        description,
        targetCount,
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
      data: collection,
      message: 'Kollektion erfolgreich aktualisiert',
    });
  } catch (error) {
    console.error('Update collection error:', error);
    res.status(500).json({
      success: false,
      error: 'Kollektion konnte nicht aktualisiert werden',
    });
  }
};

// Delete a collection
export const deleteCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Check if collection exists and belongs to user
    const existingCollection = await prisma.collection.findFirst({
      where: { id, userId },
    });

    if (!existingCollection) {
      res.status(404).json({
        success: false,
        error: 'Kollektion nicht gefunden',
      });
      return;
    }

    await prisma.collection.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Kollektion erfolgreich gelöscht',
    });
  } catch (error) {
    console.error('Delete collection error:', error);
    res.status(500).json({
      success: false,
      error: 'Kollektion konnte nicht gelöscht werden',
    });
  }
};

// Add a book to a collection
export const addBookToCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { collectionId } = req.params;
    const { bookId, status = 'COLLECTED', order, acquiredAt } = req.body;

    if (!bookId) {
      res.status(400).json({
        success: false,
        error: 'Buch-ID ist erforderlich',
      });
      return;
    }

    // Check if collection belongs to user
    const collection = await prisma.collection.findFirst({
      where: { id: collectionId, userId },
    });

    if (!collection) {
      res.status(404).json({
        success: false,
        error: 'Kollektion nicht gefunden',
      });
      return;
    }

    // Check if book belongs to user
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

    // Check if book is already in collection
    const existing = await prisma.bookCollection.findFirst({
      where: { collectionId, bookId },
    });

    if (existing) {
      res.status(400).json({
        success: false,
        error: 'Buch ist bereits in dieser Kollektion',
      });
      return;
    }

    const bookCollection = await prisma.bookCollection.create({
      data: {
        collectionId,
        bookId,
        status,
        order,
        acquiredAt: acquiredAt ? new Date(acquiredAt) : new Date(),
      },
      include: {
        book: true,
      },
    });

    res.status(201).json({
      success: true,
      data: bookCollection,
      message: 'Buch zur Kollektion hinzugefügt',
    });
  } catch (error) {
    console.error('Add book to collection error:', error);
    res.status(500).json({
      success: false,
      error: 'Buch konnte nicht zur Kollektion hinzugefügt werden',
    });
  }
};

// Remove a book from a collection
export const removeBookFromCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { collectionId, bookId } = req.params;

    // Check if collection belongs to user
    const collection = await prisma.collection.findFirst({
      where: { id: collectionId, userId },
    });

    if (!collection) {
      res.status(404).json({
        success: false,
        error: 'Kollektion nicht gefunden',
      });
      return;
    }

    // Delete the book collection relationship
    const deleted = await prisma.bookCollection.deleteMany({
      where: { collectionId, bookId },
    });

    if (deleted.count === 0) {
      res.status(404).json({
        success: false,
        error: 'Buch nicht in dieser Kollektion gefunden',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Buch aus Kollektion entfernt',
    });
  } catch (error) {
    console.error('Remove book from collection error:', error);
    res.status(500).json({
      success: false,
      error: 'Buch konnte nicht aus Kollektion entfernt werden',
    });
  }
};

// Update book status in collection
export const updateBookInCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { collectionId, bookId } = req.params;
    const { status, order } = req.body;

    // Check if collection belongs to user
    const collection = await prisma.collection.findFirst({
      where: { id: collectionId, userId },
    });

    if (!collection) {
      res.status(404).json({
        success: false,
        error: 'Kollektion nicht gefunden',
      });
      return;
    }

    // Update the book collection
    const bookCollection = await prisma.bookCollection.updateMany({
      where: { collectionId, bookId },
      data: {
        status,
        order,
      },
    });

    if (bookCollection.count === 0) {
      res.status(404).json({
        success: false,
        error: 'Buch nicht in dieser Kollektion gefunden',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Buch-Status in Kollektion aktualisiert',
    });
  } catch (error) {
    console.error('Update book in collection error:', error);
    res.status(500).json({
      success: false,
      error: 'Buch-Status konnte nicht aktualisiert werden',
    });
  }
};
