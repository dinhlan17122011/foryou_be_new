// Kiểm tra dữ liệu đặt hàng trước khi xử lý
const validateOrder = (req, res, next) => {
    const { userId, placer, address, time } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "Thiếu userId" });
    }

    if (!placer || !placer.name || !placer.phone) {
        return res.status(400).json({ message: "Thiếu thông tin người đặt hàng" });
    }

    if (!address || !address.district || !address.ward || !address.details) {
        return res.status(400).json({ message: "Thiếu thông tin địa chỉ" });
    }

    if (!time || !time.day || !time.time) {
        return res.status(400).json({ message: "Thiếu thông tin thời gian giao hàng" });
    }

    next(); // Tiếp tục xử lý nếu không có lỗi
};

export default validateOrder;
