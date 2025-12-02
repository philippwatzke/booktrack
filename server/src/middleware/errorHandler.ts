import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ZodError) {
    console.error('Validation error:', JSON.stringify(err.errors, null, 2));
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

  console.error('Error:', err.message, err.stack);

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
