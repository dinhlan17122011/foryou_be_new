import express from 'express';
import { registerUser, loginUser, verifyEmail } from '../controllers/userController.js';

const router = express.Router();

// Route đăng ký
router.post('/register', registerUser);

// Route đăng nhập
router.post('/login', loginUser);

router.post('/verify-code', verifyEmail); // Route cho việc xác thực mã


export default router;
