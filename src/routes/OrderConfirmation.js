import express from 'express';
import authenticateToken from '../middlewares/userId.js';
import {
  createOrderConfirmation,
  addAccessoriesToOrder,
  updateOrderConfirmation,
  finalizeOrderConfirmation,
  getOrdersByUserId
} from '../controllers/OrderConfirmation.js';

const router = express.Router();

router.get('/user', authenticateToken, (req, res) => {
  res.json({ userId: req.user.id });
});

router.get('/user/:userId', getOrdersByUserId);

// Tạo đơn hàng trống
router.post('/create', createOrderConfirmation);

// Thêm phụ kiện vào đơn hàng
router.post('/:id/accessory', addAccessoriesToOrder);

// Cập nhật thông tin người đặt và người nhận
router.put('/:id/update', updateOrderConfirmation);

// Xác nhận và thanh toán đơn hàng
router.put('/:id/finalize', finalizeOrderConfirmation);

export default router;
