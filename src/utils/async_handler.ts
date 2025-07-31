import { Response, Request, NextFunction, RequestHandler } from 'express';

function asyncHandler(cb: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(cb(req, res, next)).catch((error) => next(error));
  }
}

export default asyncHandler;