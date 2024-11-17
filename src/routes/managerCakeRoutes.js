import { Router } from 'express';
const router = Router();
import { getCakes, addCake, updateCake, deleteCake , add } from '../controllers/cakeControllers.js';
import { requestLogger } from '../middlewares/authMiddleware.js';
import {validateCakeData} from '../middlewares/inputDdata.js'
// Sử dụng middleware ghi log
router.use(requestLogger);

// Route để lấy danh sách bánh
router.get('/', getCakes);

// Route để thêm bánh mới với middleware kiểm tra dữ liệu
router.get('/add', add);
router.post('/add', validateCakeData, addCake);

// Route để cập nhật thông tin bánh
router.post('/update/:id', validateCakeData, updateCake);

// Route để xóa bánh
router.post('/delete/:id', deleteCake);

export default router;
