import { Router } from 'express';
import { getOrders, createOrder } from '../controller/orderController.js';

const router = Router();

router.get('/', getOrders);
router.post('/', createOrder);

export default router;