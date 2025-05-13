import { register, login, profile, updateProfile, logout, forgotPassword, resetPassword } from '../controllers/authController';
import { registerValidator, loginValidator, profileValidator, forgotPasswordValidator, resetPasswordValidator } from '../validators/authValidators';
import validate from '../middleware/validate';
import checkBlacklist from '../middleware/checkBlacklist';
import { authLimiter } from '../middleware/rateLimiter';
import passport from '../config/passport';
import { Router } from 'express';

const router = Router();

/* Utility function for async error handling */
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => fn(req, res, next).catch(next);

router.post('/register', authLimiter, registerValidator, validate, asyncHandler(register));

router.post('/login', authLimiter, loginValidator, validate, asyncHandler(login));

router.get('/profile', asyncHandler(checkBlacklist),passport.authenticate('jwt', { session: false }), asyncHandler(profile));

router.patch('/profile', asyncHandler(checkBlacklist),passport.authenticate('jwt', { session: false }), profileValidator, validate, asyncHandler(updateProfile));

router.post('/logout', passport.authenticate('jwt', { session: false }), asyncHandler(logout));

router.post('/forgot-password', authLimiter, forgotPasswordValidator, validate, asyncHandler(forgotPassword));

router.post('/reset-password', authLimiter, resetPasswordValidator, validate, asyncHandler(resetPassword));

export default router;
