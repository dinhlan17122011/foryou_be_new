import { Router } from 'express';
import { register, login } from '../controllers/userControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Route đăng ký
router.post('/register', register);

// Route đăng nhập
router.post('/login', login);

// Các route yêu cầu người dùng đã đăng nhập
router.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

export default router;
