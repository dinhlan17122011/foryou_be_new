// middlewares/checkVar.js
const checkVar = (role) => {
    return (req, res, next) => {
        // Giả sử bạn lưu thông tin người dùng trong `req.user`
        if (!req.user || (role && req.user.role !== role)) {
            return res.status(403).send('Forbidden'); // Nếu không có quyền, trả về lỗi 403
        }
        next(); // Nếu có quyền, cho phép tiếp tục
    };
};

export default checkVar;
