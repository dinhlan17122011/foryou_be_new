import express from 'express';
import { createOrder, getOrderDetails } from '../controllers/orderConfirmation.js';

const router = express.Router();

// Tạo đơn hàng từ giỏ hàng và thông tin người dùng
router.post('/create', createOrder);

// Lấy chi tiết đơn hàng theo ID
router.get('/:orderId', getOrderDetails);

export default router;
