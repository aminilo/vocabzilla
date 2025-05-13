import { Router } from 'express';
import { getAllWords, getWordDetail } from '../controllers/enController';

const router = Router();

/* Utility function for async error handling */
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => fn(req, res, next).catch(next);

router.get('/words', asyncHandler(getAllWords));                  // /api/en/words → all words
router.get('/words/:word', asyncHandler(getWordDetail));    // /api/en/words/eat → word + examples
// router.get('/examples', asyncHandler(getExamples));               // /api/en/examples?word=eat → examples for word

export default router;
