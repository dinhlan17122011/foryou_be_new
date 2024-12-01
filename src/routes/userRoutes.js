import express from 'express';
import { registerUser, loginUser, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

// Route đăng ký
router.post('/register', registerUser);

// Route đăng nhập
router.post('/login', loginUser);

// Route lấy danh sách người dùng
router.get('/', getAllUsers);

export default router;
