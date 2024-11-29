import { Router } from 'express';
const router = Router();
import { getCakes, addCake, updateCake, deleteCake , add ,update ,viewCake} from '../controllers/cakeControllers.js';
// import  requestLogger  from '../middlewares/authMiddleware.js';
import requestLogger from '../middlewares/authMiddleware.js';

import {validateCakeData} from '../middlewares/inputDdata.js'
import CategoryModel from '../models/CategoryModels.js';

// router.use(someVariable);

// Sử dụng middleware ghi log
// router.use(requestLogger);

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
router.post('/category/create', async (req, res) => {
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

// Endpoint để xóa thể loại theo ID
router.delete('/delete/:id', async (req, res) => {
    try {
        console.log('Deleting category with ID:', req.params.id); // Log để kiểm tra ID

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const category = await CategoryModel.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Error deleting category' });
    }
});

// Hiển thị danh sách thể loại
router.get('/category', async (req, res) => {
    try {
        console.log('Deleting category with ID:', req.params.id);
        const categories = await CategoryModel.find();
        res.render('manageCategories', { categories }); // Gửi danh sách category đến giao diện
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Error fetching categories');
    }
});



export default router;
