import { Router } from 'express';
const router = Router();
import { getCakes, addCake, updateCake, deleteCake } from '../controllers/cakeControllers';
import { requestLogger, validateCakeData } from '../middlewares/';

// Sử dụng middleware ghi log
router.use(requestLogger);

// Route để lấy danh sách bánh
router.get('/', getCakes);

// Route để thêm bánh mới với middleware kiểm tra dữ liệu
router.post('/add', validateCakeData, addCake);

// Route để cập nhật thông tin bánh
router.post('/update/:id', validateCakeData, updateCake);

// Route để xóa bánh
router.post('/delete/:id', deleteCake);

export default router;
