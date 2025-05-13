import { rateLimit } from 'express-rate-limit';

export const authLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, /* 10 Minutes */
	max: process.env.NODE_ENV === 'test' ? 50 : 10, /* Limit each IP to 10 requests per windowMs */
	message: 'Too many requests; please try again after 10 minutes',
	standardHeaders: true,
	legacyHeaders: false
});
