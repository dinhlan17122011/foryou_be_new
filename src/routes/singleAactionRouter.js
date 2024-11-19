import express from 'express';
import { placeOrder } from '../controllers/singleAction';

const router = express.Router();

// Đặt hàng
router.post('/placeOrder', placeOrder);

export default router;
