import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

// Đăng ký người dùng
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Không mã hóa mật khẩu
        const newUser = new User({
            name,
            email,
            password, // Lưu mật khẩu không mã hóa
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// Đăng nhập người dùng
import generateToken from '../middlewares/generateToken.js'; // Đảm bảo bạn đã import đúng hàm generateToken

// Đăng nhập người dùng
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Kiểm tra người dùng trong cơ sở dữ liệu
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user); // Tạo token
        res.json({
            message: "Login successful",
            token,
            user: { name: user.name }, // Đảm bảo trả về dữ liệu đúng
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
