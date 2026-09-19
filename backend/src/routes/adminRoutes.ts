import { Router } from 'express';
import { adminLogin, getDashboardStats, getActivityLogs, postConsultation } from '../controller/adminController.js';

const router = Router();

router.post('/login', adminLogin);
router.get('/dashboard-stats', getDashboardStats);
router.get('/activity-logs', getActivityLogs);
router.post('/consultations', postConsultation);

export default router;