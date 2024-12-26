import express from 'express';
import { createOrder, updateOrder, validateOrder } from '../controllers/OrderConfirmation.js';

const router = express.Router();

// Route tạo đơn hàng mới
router.post('/orders', createOrder);

// Route cập nhật thông tin đơn hàng theo userId
router.put('/orders/:userId', updateOrder);

// Route kiểm tra tính hợp lệ của đơn hàng
router.get('/orders/:userId/validate', validateOrder);

export default router;
