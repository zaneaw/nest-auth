import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  // console.log(`Request...\n${req.method}\n${req.body}`);
  next();
}
