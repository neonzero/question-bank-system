import { Router } from 'express';
import { startPractice, startExam, answerQuestion, endSession } from '../controllers/sessionController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/start-practice', protect, startPractice);
router.post('/start-exam', protect, startExam);
router.post('/answer', protect, answerQuestion);
router.post('/end', protect, endSession);

export default router;
