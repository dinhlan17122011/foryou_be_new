// Middleware để kiểm tra dữ liệu đầu vào
function validateCakeData(req, res, next) {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).send('Thiếu tên hoặc giá của bánh');
    }
    next();
}

module.exports = {
    validateCakeData
};
