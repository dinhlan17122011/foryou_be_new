import express from 'express';
import { createCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/categoryController.js';

const router = express.Router();

// Route tạo mới thể loại
router.post('/', createCategory);

// Route lấy danh sách tất cả thể loại
router.get('/', getAllCategories);

// Route cập nhật thể loại
router.put('/:id', updateCategory);

// Route xóa thể loại
router.delete('/:id', deleteCategory);

export default router;
