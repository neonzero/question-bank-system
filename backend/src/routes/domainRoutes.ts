import { Router } from 'express';
import { getDomains, createDomain, updateDomain, deleteDomain } from '../controllers/domainController';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, admin, getDomains);
router.post('/', protect, admin, createDomain);
router.put('/:id', protect, admin, updateDomain);
router.delete('/:id', protect, admin, deleteDomain);

export default router;
