import { Router } from 'express';
import { getSettings, updateSettings, verifyPromoCode } from '../controller/settingController.js';

const router = Router();

router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/verify', verifyPromoCode);

export default router;