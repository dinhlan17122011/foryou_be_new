import express from 'express';
import { addToCart, confirmOrderInfo, placeOrder ,getInvoices,printOrder} from '../controllers/singleAction.js';
import requestLogger  from '../middlewares/authMiddleware.js'; // Middleware xác thực
// import authenticateToken from './middlewares/authMiddleware.js';

const router = express.Router();

router.post('/cart', requestLogger, addToCart); // Thêm sản phẩm vào giỏ hàng
router.put('/order/confirm', requestLogger, confirmOrderInfo); // Xác nhận thông tin
router.post('/order/place', requestLogger, placeOrder); // Gộp dữ liệu thành hóa đơn
router.get('/invoices', requestLogger, getInvoices); // Lấy danh sách hóa đơn
router.get('/order/:orderId/print', printOrder);

export default router;
