import { z } from 'zod';

// Book Status
export const BookStatusSchema = z.enum(['WANT_TO_READ', 'READING', 'FINISHED']);
export type BookStatus = z.infer<typeof BookStatusSchema>;

// Book Schemas
export const CreateBookSchema = z.object({
  isbn: z.string().optional(),
  title: z.string().min(1, 'Titel ist erforderlich'),
  author: z.string().min(1, 'Autor ist erforderlich'),
  description: z.string().optional(),
  coverUrl: z.string().url().optional().or(z.literal('')),
  publisher: z.string().optional(),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear() + 1).optional(),
  pageCount: z.number().int().min(1, 'Seitenzahl muss mindestens 1 sein'),
  language: z.string().optional(),
  status: BookStatusSchema,
  priority: z.number().int().min(1).max(5).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  currentPage: z.number().int().min(0).optional(),
  genres: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
});

export const UpdateBookSchema = CreateBookSchema.partial();

export type CreateBookInput = z.infer<typeof CreateBookSchema>;
export type UpdateBookInput = z.infer<typeof UpdateBookSchema>;

// Reading Session Schemas
export const CreateReadingSessionSchema = z.object({
  bookId: z.string().min(1),
  duration: z.number().int().min(0),
  pagesRead: z.number().int().min(0),
  startPage: z.number().int().min(0),
  endPage: z.number().int().min(0),
  notes: z.string().optional(),
  // Session Timer Improvements (2.4)
  location: z.enum(['HOME', 'COMMUTE', 'CAFE', 'TRAVEL', 'OTHER']).optional(),
  timeOfDay: z.enum(['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT']).optional(),
  mood: z.enum(['FOCUSED', 'RELAXED', 'TIRED', 'ENERGETIC']).optional(),
  targetDuration: z.number().int().min(0).optional(),
  targetPages: z.number().int().min(0).optional(),
  quality: z.number().int().min(1).max(5).optional(),
  reflection: z.string().optional(),
});

export const UpdateReadingSessionSchema = z.object({
  duration: z.number().int().min(0).optional(),
  pagesRead: z.number().int().min(0).optional(),
  startPage: z.number().int().min(0).optional(),
  endPage: z.number().int().min(0).optional(),
  notes: z.string().optional(),
  location: z.enum(['HOME', 'COMMUTE', 'CAFE', 'TRAVEL', 'OTHER']).optional(),
  timeOfDay: z.enum(['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT']).optional(),
  mood: z.enum(['FOCUSED', 'RELAXED', 'TIRED', 'ENERGETIC']).optional(),
  targetDuration: z.number().int().min(0).optional(),
  targetPages: z.number().int().min(0).optional(),
  quality: z.number().int().min(1).max(5).optional(),
  reflection: z.string().optional(),
});

export type CreateReadingSessionInput = z.infer<typeof CreateReadingSessionSchema>;
export type UpdateReadingSessionInput = z.infer<typeof UpdateReadingSessionSchema>;

// Quote Schemas
export const CreateQuoteSchema = z.object({
  bookId: z.string().min(1),
  text: z.string().min(1, 'Zitat-Text ist erforderlich'),
  page: z.number().int().min(1).optional(),
});

export const UpdateQuoteSchema = z.object({
  text: z.string().min(1).optional(),
  page: z.number().int().min(1).optional(),
});

export type CreateQuoteInput = z.infer<typeof CreateQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof UpdateQuoteSchema>;

// Note Schemas
export const CreateNoteSchema = z.object({
  bookId: z.string().min(1),
  content: z.string().min(1, 'Notiz-Inhalt ist erforderlich'),
  page: z.number().int().min(1).optional(),
});

export const UpdateNoteSchema = z.object({
  content: z.string().min(1).optional(),
  page: z.number().int().min(1).optional(),
});

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;

// Auth Schemas
export const RegisterSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein'),
  name: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

// JWT Payload
export interface JwtPayload {
  userId: string;
  email: string;
}

// Streak Schemas
export const UseFreezeSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum muss im Format YYYY-MM-DD sein'),
});

export type UseFreezeInput = z.infer<typeof UseFreezeSchema>;

// Streak Response Types
export interface StreakData {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;
  freezeDaysUsed: number;
  freezeDaysAvailable: number;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string;
  duration: number;
  pagesRead: number;
  booksRead: string[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
