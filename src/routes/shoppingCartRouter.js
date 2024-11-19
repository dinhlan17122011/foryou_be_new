import express from 'express';
import { addToCart, getCart, updateCart, removeFromCart } from '../controllers/shoppingCart.js';

const router = express.Router();

// Thêm sản phẩm vào giỏ hàng
router.post('/add', addToCart);

// Lấy giỏ hàng của người dùng
router.get('/:userId', getCart);

// Cập nhật giỏ hàng (ví dụ: thay đổi số lượng sản phẩm)
router.put('/update/:itemId', updateCart);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/remove/:itemId', removeFromCart);

export default router;
