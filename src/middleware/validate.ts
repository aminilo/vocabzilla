import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export default function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if( !errors.isEmpty() ){
    // console.log("Validation Errors:", errors.array().map(err=> ({ msg: err.msg, param: (err as any).path })));
    res.status(400).json({ error: errors.array().map(err=> ({ msg: err.msg, param: (err as any).path })) })
    return;
  }
  next();
};
