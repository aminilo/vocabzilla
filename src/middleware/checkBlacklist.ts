import redisClient from '../config/redis';
import { Request, Response, NextFunction } from 'express';

export default async function checkBlacklist(req: Request, res: Response, next: NextFunction): Promise<void> {
	const token = req.headers.authorization?.split(' ')[1];
	if(!token){
		res.status(401).json({ msg: 'Unauthorized - No Token' }); return;
	}

	const isBlacklisted = await redisClient.get(`blacklist:${token}`);
	if(isBlacklisted){
		res.status(401).json({ msg: 'Token is blacklisted' }); return;
	}

	next();
}
