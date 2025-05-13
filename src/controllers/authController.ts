import prisma from '../utils/prismaClient';
import redisClient from '../config/redis';
import { sendForgotPassMail } from '../utils/sendForgotPassMail';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

interface User {
	id: number;
	email: string;
	password?: string;
	username?: string;
}

export const register = async (req: Request, res: Response, next: NextFunction)=> {
	const { username, email, password } = req.body; 
	try{
		if( await prisma.user.findUnique({ where: { email } }) ) return res.status(409).json({ error: [{ msg: 'User already exists', param: 'email' }] });
		const newUser = await prisma.user.create({
			data: { username, email, password: await bcrypt.hash(password, 11) }
		});
		res.status(201).json({ msg: 'User registered successfully', user: { email: newUser.email } });
		// res.status(201).json({ msg: 'User registered successfully', user: Pick<User, email> });
	}catch(err){ next(err); }
};

export const login = async (req: Request, res: Response, next: NextFunction)=> {
	const { email, password } = req.body;
	try{
		const user = await prisma.user.findUnique({ where: { email } });
		if(!user || !(await bcrypt.compare(password, user?.password))) return res.status(401).json({ error: [{ msg: 'Invalid Credentials', param: 'general' }] });
		const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
		res.status(200).json({ token, user: { id: user.id, email, username: user.username } });
	}catch(err){ next(err); }
};

export const profile = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const cacheKey = `user:profile:${userId}`;

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log(`[CACHE] Hit for user ${userId}`);
      return res.status(200).json({ user: JSON.parse(cached) });
    }

    /* Fetch fresh user from DB */
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        xp: true,
        level: true,
        createdAt: true
      }
    });

    if( !user ) return res.status(404).json({ error: 'User not found' });

    /* Cache the result for 5 minutes */
    await redisClient.set(cacheKey, JSON.stringify(user), { EX: 60 * 5 });

    res.status(200).json({ user });
  } catch (err) { next(err); }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction)=> {
  const userId = req.user?.id;
  const { username, password, currentPassword } = req.body;
  try{
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if(!user) return res.status(404).json({ error: [{ msg: 'User not found', param: 'general' }] });

    if(password){
      if( !currentPassword ) return res.status(400).json({ error: [{ msg: 'Current password is required', param: 'currentPassword' }] });
      if( !(await bcrypt.compare(currentPassword, user.password)) ) return res.status(401).json({ error: [{ msg: 'Current password is incorrect', param: 'currentPassword' }] });
    }

    const updateData: { username?: string; password?: string; } = {};
    if(username && username !== user.username) updateData.username = username;
    if(password) updateData.password = await bcrypt.hash(password, 11);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    /* Invalidate profile cache */
    await redisClient.del(`user:profile:${userId}`);

    res.json({ user: { id: updatedUser.id, username: updatedUser.username } });
  }catch(err){ next(err); }
};

export const logout = async (req: Request, res: Response)=> {
	const token = req.headers.authorization?.split(' ')[1];
	// if(!token) return res.status(400).json({ msg: 'Token not provided' });
	if(!token) return res.status(204).send(); /* if somehow token is undefined here (which shouldn't happen), just return 204 anyway */
	await redisClient.set(`blacklist:${token}`, 'true', { EX: 3600 });
	res.status(204).send();
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction)=> {
	const { email } = req.body;
	try{
		const user = await prisma.user.findUnique({ where: { email } });
		if(!user) return res.status(404).json({ error: [{ msg: 'No user with that email', param: 'email' }] });

		const resetToken = crypto.randomBytes(32).toString('hex');
		await redisClient.set(`resetToken:${resetToken}`, user.id.toString(), { EX: 660 });

		const resetLink = `http://${process.env.HOST || 'localhost'}:${process.env.CLIENT_PORT || 1234}/reset-password?token=${resetToken}`;
		const html = `
			<p>Click to reset your password: <a href="${resetLink}" target="_self">${resetLink}</a></p>
			<p>This link will expire after 11 minutes.</p>
		`;
		await sendForgotPassMail(email, 'Reset Your Password', html);

		res.status(200).json({ msg: 'Password reset email sent' });
	}catch(err){ next(err); }
};

export const resetPassword = async (req: Request, res: Response)=> {
	const { token, password } = req.body;
	const userId = await redisClient.get(`resetToken:${token}`);
	if(!userId) return res.status(400).json({ error: [{ msg: 'Invalid / Expired Token', param: 'token' }] });

	await prisma.user.update({
		where: { id: Number(userId) },
		data: { password: await bcrypt.hash(password, 11) }
	});
	await redisClient.del(`resetToken:${token}`);

	res.status(200).json({ msg: 'Password reset successful' });
};
