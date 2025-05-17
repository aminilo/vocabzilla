import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prismaClient';
import redisClient from '../config/redis';

export const getHanzi = async (req: Request, res: Response, next: NextFunction)=> {
  const { search, page = 1, pageSize = 20 } = req.query;
  const searchStr = typeof search === 'string' ? search.trim() : undefined;
  const pageNumber = parseInt(page as string, 10);
  const limit = parseInt(pageSize as string, 10);
  const cacheKey = `hanzi:all:${searchStr || 'all'}:page:${pageNumber}:limit:${limit}`;

  try{
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      // console.log(`[CACHE HIT] ${cacheKey}`);
      return res.status(200).json(JSON.parse(cached));
    }

    const whereClause = searchStr ? { hanzi: { equals: searchStr } } : {};

    const [total, characters] = await Promise.all([
      prisma.hanzi.count({ where: whereClause }),
      prisma.hanzi.findMany({
        where: whereClause,
        skip: (pageNumber - 1) * limit,
        take: limit,
        select: { id: true, hanzi: true }
      })
    ]);

    const response = { total, page: pageNumber, totalPages: Math.ceil(total / limit), limit, characters };

    /* ⏳ Cache for 1 hour */
    await redisClient.set(cacheKey, JSON.stringify(response), { EX: 60 * 60 });

    res.status(200).json(response);
  }catch(err){ next(err); }
};

export const getHanziWithWords = async (req: Request, res: Response, next: NextFunction)=> {
  const { zi } = req.params;
  const redisKey = `hanzi:withWords:${zi}`;
  try{
    /* 🔍 Try to get from Redis */
    const cached = await redisClient.get(redisKey);
    if( cached ) {
      // console.log(`[CACHE HIT] ${redisKey}`);
      return res.json(JSON.parse(cached));
    }

    /* ❌ Not cached: fetch from DB */
    const hanziRecord = await prisma.hanzi.findUnique({ where: { hanzi: zi } });
    if(!hanziRecord) return res.status(404).json({ error: "Hanzi not found" });

    const cihuiRecord = await prisma.cihui.findMany({
      where: { ch: { contains: zi } }
    });

    const response = { hanziRecord, cihuiRecord };
    
    /* 💾 Save to Redis for 1 hour */
    await redisClient.set(redisKey, JSON.stringify(response), { EX: 60 * 60 });

    res.status(200).json(response);
  }catch(err){ next(err); }
};
