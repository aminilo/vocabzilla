import { HttpError } from '../utils/HttpError';
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: HttpError | Error, req: Request, res: Response, next: NextFunction)=> {
	const statusCode = (err as HttpError).statusCode || 500;
	res.status(statusCode).json({
		error: err.message || 'Internal Server Error',
		stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
	});
};

export default errorHandler;
