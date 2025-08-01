import { Response, Request, NextFunction, RequestHandler } from 'express';
import APIError from './api_error';

function asyncHandler(cb: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(cb(req, res, next)).catch((error) => {
      if (error instanceof (APIError)) {
        console.log(error);
        return res.status(error.statusCode).json({
          errorMessage: error.message
        });
      }
      return next();
    });
  }
}

export default asyncHandler;