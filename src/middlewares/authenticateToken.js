import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware kiểm tra token
const authenticateToken = (req, res, next) => {
    // Lấy token từ header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Lấy token sau "Bearer"

    if (!token) {
        return res.status(403).json({ message: 'No token, authorization denied' });
    }

    // Xác minh token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token is not valid' });
        }

        // Lưu thông tin người dùng vào req.user
        req.user = decoded;
        next(); // Tiếp tục xử lý request
    });
};

export default authenticateToken;
