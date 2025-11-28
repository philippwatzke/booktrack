export type BookStatus = "WANT_TO_READ" | "READING" | "FINISHED";

export interface Book {
  id: string;
  isbn?: string;
  title: string;
  author: string;
  description?: string;
  coverUrl?: string;
  publisher?: string;
  publishedYear?: number;
  pageCount: number;
  language?: string;
  status: BookStatus;
  priority?: number;
  rating?: number;
  currentPage?: number;
  genres?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  startTime: string;
  endTime?: string;
  pagesRead: number;
  notes?: string;
}

export interface Quote {
  id: string;
  bookId: string;
  text: string;
  page?: number;
  createdAt: string;
}

export interface Note {
  id: string;
  bookId: string;
  content: string;
  page?: number;
  createdAt: string;
}
