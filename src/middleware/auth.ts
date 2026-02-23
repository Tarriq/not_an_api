import type { Request, Response, NextFunction } from 'express';

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const userKey = req.header('x-api-key');
  const serverKey = process.env.API_ACCESS_KEY;

  if (userKey && userKey === serverKey) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Access Denied' });
  }
};