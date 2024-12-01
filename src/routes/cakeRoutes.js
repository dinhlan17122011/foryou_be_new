import express from 'express';
import { getCakes, getCakeById, createCake, updateCake, deleteCake } from '../controllers/cakeController.js';

const router = express.Router();

router.get('/', getCakes); // Lấy tất cả bánh
router.get('/:id', getCakeById); // Lấy bánh theo ID
router.post('/', createCake); // Tạo bánh mới
router.put('/:id', updateCake); // Cập nhật bánh
router.delete('/:id', deleteCake); // Xóa bánh

export default router;
