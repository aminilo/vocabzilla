import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prismaClient';
import { Prisma } from '@prisma/client';
import redisClient from '../config/redis';

export const getAllWords = async (req: Request, res: Response, next: NextFunction)=> {
	const { search, page = 1, pageSize = 20 } = req.query;
	const searchStr = typeof search === 'string' ? search.trim() : undefined;
	const pageNumber = parseInt(page as string, 10);
	const limit = parseInt(pageSize as string, 10);
	// const cacheKey = `enword:all:${searchStr || 'all'}:page:${pageNumber}:limit:${limit}`;
	
	try{
		// const cached = await redisClient.get(cacheKey);
		// if (cached) {
		// 	console.log(`[CACHE HIT] ${cacheKey}`);
		// 	return res.status(200).json(JSON.parse(cached));
		// }

		const whereClause = searchStr ? { word: { contains: searchStr, mode: Prisma.QueryMode.insensitive } } : {};

		const [total, words] = await Promise.all([
			prisma.enword.count({ where: whereClause }),
			prisma.enword.findMany({
				where: whereClause,
				skip: (pageNumber - 1) * limit,
				take: limit,
				orderBy: { word: 'asc' },
				select: { id: true, word: true }
			})
		]);

		const response = { total, page: pageNumber, totalPages: Math.ceil(total / limit), limit, words };

		/* ⏳ Cache for 1 hour */
		// await redisClient.set(cacheKey, JSON.stringify(response), { EX: 60 * 60 });

		res.status(200).json(response);
	}catch(err){ next(err); }
};

export const getWordDetail = async (req: Request, res: Response, next: NextFunction)=> {
	const { word } = req.params;
	const redisKey = `enword:detail:${word}`;
	try{
		/* 🔍 Try to get from Redis */
		const cached = await redisClient.get(redisKey);
		if( cached ) {
			console.log(`[CACHE HIT] ${redisKey}`);
			return res.status(200).json(JSON.parse(cached));
		}

		/* ❌ Not cached: fetch from DB */
		const wordData = await prisma.enword.findUnique({
			where: { word },
			include: {
				examples: true,
				wordFamilyMembers: {
					include: {
						group: {
							include: { words: true }
						}
					}
				}
			}
		});
		if(!wordData) return res.status(404).json({ error: `No details found for word: "${word}"` })

		/* Flatten and clean up the word family group */
		const wordFamily = wordData.wordFamilyMembers?.[0]?.group?.words?.filter(w => w.word !== word) || [];
		const response = { ...wordData, wordFamily };

		/* 💾 Save to Redis for 1 hour */
		await redisClient.set(redisKey, JSON.stringify(response), { EX: 60 * 60 });

		res.status(200).json(response);
	}catch(err){ next(err); }
};
