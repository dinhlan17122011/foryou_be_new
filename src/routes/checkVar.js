import express from 'express';
import checkVar  from '../middlewares/checkVar.js'; // Middleware kiểm tra quyền người dùng
import User from '../models/UserModel.js'; // Giả sử bạn có model User

const router = express.Router();

// Route cho Dashboard
router.get('/dashboard', checkVar('user'), async (req, res) => {
    try {
        // Giả sử bạn lưu thông tin người dùng trong `req.user`
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Render view dashboard và truyền thông tin người dùng
        res.render('dashboard', { user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Server error');
    }
});

// Route cho Admin Dashboard
router.get('/admin', checkVar('admin'), async (req, res) => {
    try {
        // Chỉ cho phép admin vào trang này
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('adminDashboard', { user }); // Giả sử bạn có view adminDashboard
    } catch (error) {
        console.error('Error fetching admin data:', error);
        res.status(500).send('Server error');
    }
});

export default router;
