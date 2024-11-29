import dotenv from 'dotenv';
dotenv.config();  // Tải các biến môi trường từ file .env

import jwt from 'jsonwebtoken';

// Tạo token cho người dùng
const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, name: user.name }, // Payload
        process.env.JWT_SECRET,  // Secret key từ biến môi trường
        { expiresIn: '1h' }  // Thời gian hết hạn
    );
};

export default generateToken;
