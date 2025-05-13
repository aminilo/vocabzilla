import { Router } from 'express';
import { getHanzi, getHanziWithWords } from '../controllers/chController';

const router = Router();

/* Utility function for async error handling */
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => fn(req, res, next).catch(next);

router.get('/hanzi', asyncHandler(getHanzi));
router.get('/hanzi/:zi', asyncHandler(getHanziWithWords));
// router.get('/cihui/:word', asyncHandler(getWordDetails));

export default router;
