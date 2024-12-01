import express from 'express';
import { placeOrder, getInvoices } from '../controllers/cartController.js';
import validateOrder from '../middlewares/validateOrder.js';
import checkShoppingCart from '../middlewares/checkShoppingCart.js';

const router = express.Router();

// Đặt hàng với middleware kiểm tra
router.post('/place-order', validateOrder, checkShoppingCart, placeOrder);

// Lấy danh sách hóa đơn
router.get('/invoices/:userId', getInvoices);

export default router;
