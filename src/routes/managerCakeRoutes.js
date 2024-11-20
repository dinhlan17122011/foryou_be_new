import { Router } from 'express';
const router = Router();
import { getCakes, addCake, updateCake, deleteCake , add ,update ,viewCake} from '../controllers/cakeControllers.js';
import { requestLogger } from '../middlewares/authMiddleware.js';
import {validateCakeData} from '../middlewares/inputDdata.js'
import CategoryModel from '../models/CategoryModels.js';

// Sử dụng middleware ghi log
router.use(requestLogger);

router.get('/view/:id', viewCake);

// Route để lấy danh sách bánh
router.get('/', getCakes);

// Route để thêm bánh mới với middleware kiểm tra dữ liệu
router.get('/add', add);
router.post('/add', validateCakeData, addCake);

// Route để cập nhật thông tin bánh
router.get('/update/:id', update); // Hiển thị form cập nhật
router.post('/update/:id', updateCake); // Cập nhật cake

// Route để xóa bánh
router.post('/delete/:id', deleteCake);

router.get('/create', (req, res) => {
    res.render('createCategory'); // Tên file giao diện ejs hoặc view khác
});

// Endpoint để xử lý tạo thể loại mới
router.post('/create', async (req, res) => {
    try {
        const { name } = req.body;

        // Kiểm tra nếu tên thể loại đã tồn tại
        const existingCategory = await CategoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(400).send('Category already exists');
        }

        const newCategory = new CategoryModel({ name });
        await newCategory.save();

        res.redirect('/cake'); // Redirect đến danh sách thể loại (hoặc trang khác)
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).send('Error creating category');
    }
});



export default router;
