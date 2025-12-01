import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Validierungsfehler',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: 'Ungültiger Token',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'Token abgelaufen',
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: 'Interner Serverfehler',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
