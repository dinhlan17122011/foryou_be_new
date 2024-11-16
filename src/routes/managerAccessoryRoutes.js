import { Router } from 'express';
const router = Router();
import { getAccessories, addAccessory, updateAccessory } from '../controllers/accessoryControllers';

// Route để xem danh sách phụ kiện
router.get('/', getAccessories);

// Route để thêm phụ kiện mới
router.post('/add', addAccessory);

// Route để cập nhật phụ kiện
router.post('/update/:id', updateAccessory);

export default router;
