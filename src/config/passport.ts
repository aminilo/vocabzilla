import prisma from '../utils/prismaClient';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';

// interface JwtPayload {
//   id: number;
// }

// type DoneCallback = (error: any, user?: any) => void;

passport.use(new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET as string || 'default_secret'
}, async (jwtPayload: any, done: any)=> {
	try{
		const user = await prisma.user.findUnique({ where: { id: jwtPayload.id } });
		return user ? done(null, user) : done(null, false);
	}catch(err){ return done(err, false); }
}));

export default passport;
