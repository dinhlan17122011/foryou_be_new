import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Đăng ký người dùng
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra các trường dữ liệu
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
        }

        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công", user: savedUser });
    } catch (error) {
        console.error("Lỗi khi đăng ký người dùng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Đăng nhập người dùng
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra các trường dữ liệu
        if (!email || !password) {
            return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
        }

        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại" });
        }

        // So sánh mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Sai mật khẩu" });
        }

        // Tạo token JWT
        const token = jwt.sign(
            { id: user._id },
            "your_jwt_secret", // Nên lưu trong biến môi trường
            { expiresIn: "1d" }
        );

        res.status(200).json({ message: "Đăng nhập thành công", token });
    } catch (error) {
        console.error("Lỗi khi đăng nhập người dùng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Lấy danh sách tất cả người dùng
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Loại bỏ mật khẩu khi trả về
        res.status(200).json(users);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
