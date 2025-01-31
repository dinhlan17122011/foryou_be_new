import express from 'express';
import authenticateToken from '../middlewares/userId.js';
import {
  createOrderConfirmation,
  addAccessoriesToOrder,
  updateOrderConfirmation,
  getOrdersByUserId,
  deleteOrderConfirmation,
  updateProductStatus
} from '../controllers/OrderConfirmation.js';

import OrderConfirmation from '../models/orderConfirmationModels.js';

const router = express.Router();

router.get('/user', authenticateToken, (req, res) => {
  res.json({ userId: req.user.id });
});

router.delete('/orders/:id', deleteOrderConfirmation);

router.get('/user/:userId', getOrdersByUserId);

// Tạo đơn hàng trống
router.post('/create', createOrderConfirmation);

// Thêm phụ kiện vào đơn hàng
router.post('/:id/accessory', addAccessoriesToOrder);

// Cập nhật thông tin người đặt và người nhận
router.put('/:id/update', updateOrderConfirmation);

router.put('/update-status', updateProductStatus);

export default router;
