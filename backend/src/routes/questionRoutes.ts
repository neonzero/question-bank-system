import { Router } from 'express';
import { getQuestions, createQuestion, bulkUpload, updateQuestion, deleteQuestion } from '../controllers/questionController';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();
router.get('/', protect, getQuestions);
router.post('/', protect, admin, createQuestion);
router.post('/bulk', protect, admin, bulkUpload);
router.put('/:id', protect, admin, updateQuestion);
router.delete('/:id', protect, admin, deleteQuestion);

export default router;
