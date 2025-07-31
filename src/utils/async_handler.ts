import { Response, Request, NextFunction } from 'express';

interface Handler {
  req: Request,
  res: Response,
  next: NextFunction,
}

const asyncHandler = (requestHandler: ({ req, res, next }: Handler) => Promise<void>) => {
  ({ req, res, next }: Handler) => {
    Promise.resolve(requestHandler({ req, res, next })).catch((err) => next(err));
  }
}

export default asyncHandler;