import authRoutes from './authRoutes';
import enRoutes from './enRoutes';
import chRoutes from './chRoutes';
import { Router } from 'express';

const router = Router();

router.use('/auth', authRoutes);
router.use('/en', enRoutes);
router.use('/ch', chRoutes);

export default router;
