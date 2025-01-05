import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'; // Import đúng cách
import dotenv from 'dotenv';
dotenv.config(); // Nạp các biến môi trường từ .env

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Gửi email chứa mã xác thực
const sendVerificationEmail = async (email, verificationCode) => {
    const mailOptions = {
        from: `"Your App Name" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Xác thực tài khoản của bạn",
        html: `<h3>Chào mừng bạn đến với ứng dụng của chúng tôi!</h3>
               <p>Mã xác thực của bạn là:</p>
               <h2>${verificationCode}</h2>
               <p>Nhập mã này vào trang xác thực tài khoản để hoàn tất.</p>`,
    };
    return transporter.sendMail(mailOptions);
};

// Đăng ký
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            verificationCode,
            isVerified: false,
        });

        const savedUser = await newUser.save();

        await sendVerificationEmail(email, verificationCode);

        res.status(201).json({
            message: "Đăng ký thành công. Hãy kiểm tra email để lấy mã xác thực.",
            user: { id: savedUser._id, email: savedUser.email },
        });
    } catch (error) {
        console.error("Lỗi khi đăng ký người dùng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Xác thực email
export const verifyEmail = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Tài khoản đã được xác thực" });
        }

        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: "Mã xác thực không chính xác" });
        }

        user.isVerified = true;
        user.verificationCode = null;
        await user.save();

        res.status(200).json({ message: "Xác thực tài khoản thành công" });
    } catch (error) {
        console.error("Lỗi khi xác thực email:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Đăng nhập
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Tài khoản chưa được xác thực" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }

    // Lưu userId vào session
    req.session.userId = user._id

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: { name: user.name,id: user.id },
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};