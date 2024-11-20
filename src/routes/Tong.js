import express from 'express';
import { getDashboardStats } from '../controllers/Tong.js';

const router = express.Router();

// Route lấy tổng số người dùng, bánh và đơn hàng
router.get('/dashboard', getDashboardStats);

export default router;
