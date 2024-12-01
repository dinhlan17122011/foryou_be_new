import express from 'express';
import {
    createAccessory,
    getAccessories,
    getAccessoryById,
    updateAccessory,
    deleteAccessory,
} from '../controllers/accessoryController.js';

const router = express.Router();

// Tạo phụ kiện mới
router.post('/', createAccessory);

// Lấy danh sách phụ kiện
router.get('/', getAccessories);

// Lấy chi tiết phụ kiện theo ID
router.get('/:id', getAccessoryById);

// Cập nhật phụ kiện
router.put('/:id', updateAccessory);

// Xóa phụ kiện
router.delete('/:id', deleteAccessory);

export default router;
