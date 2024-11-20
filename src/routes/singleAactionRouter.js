import express from 'express'
// import { placeOrder, getUserOrders, getOrderDetails, updateOrderStatus, cancelOrder } from '../controllers/orderController.js';
// Kiểm tra lại import của bạn
import { placeOrder, getUserOrders, updateOrderStatus, cancelOrder, getOrderDetails } from '../controllers/singleAction.js';


const router = express.Router();

// Đặt hàng mới
router.post('/place-order', placeOrder);

// Xem danh sách đơn hàng của người dùng
router.get('/orders', getUserOrders);

// Xem chi tiết một đơn hàng
router.get('/order/:orderId', getOrderDetails);

// Cập nhật trạng thái đơn hàng
router.put('/order/:orderId/status', updateOrderStatus);

// Hủy đơn hàng
router.delete('/order/:orderId', cancelOrder);

export default router;