import OrderConfirmation from '../models/orderConfirmationModels.js';

// Tạo đơn hàng mới khi người dùng nhấn vào nút "Mua hàng"
export const createOrder = async (req, res) => {
    try {
        const { userId } = req.body;

        // Kiểm tra nếu userId không tồn tại
        if (!userId) {
            return res.status(400).json({ error: 'UserId là bắt buộc.' });
        }

        // Tạo đơn hàng ban đầu với thông tin mặc định
        const newOrder = new OrderConfirmation({
            userId,
            placer: {
                name: '', // Giá trị mặc định
                phone: '', // Giá trị mặc định
            },
            receiver: {
                similarToAbove: false,
                name: '',
                phone: '',
            },
            address: {
                district: '',
                ward: '',
                details: '',
            },
            bill: {
                tickBill: false,
            },
            time: {
                day: '',
                time: '',
            },
        });

        await newOrder.save();
        return res.status(201).json({ message: 'Đơn hàng được tạo thành công.', order: newOrder });
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server.', details: error.message });
    }
};

// Cập nhật thông tin đơn hàng
export const updateOrder = async (req, res) => {
    try {
        const { userId } = req.params; // Lấy userId từ URL
        const updateData = req.body; // Dữ liệu từ FE gửi lên

        // Tìm đơn hàng theo userId
        const order = await OrderConfirmation.findOne({ userId });

        if (!order) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng với userId này.' });
        }

        // Cập nhật thông tin từ updateData
        Object.keys(updateData).forEach((key) => {
            if (key in order) {
                order[key] = updateData[key];
            }
        });

        // Lưu thay đổi
        await order.save();
        return res.status(200).json({ message: 'Đơn hàng được cập nhật thành công.', order });
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server.', details: error.message });
    }
};

// Kiểm tra tính hợp lệ của dữ liệu
export const validateOrder = async (req, res) => {
    try {
        const { userId } = req.params; // Lấy userId từ URL

        // Tìm đơn hàng theo userId
        const order = await OrderConfirmation.findOne({ userId });

        if (!order) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng với userId này.' });
        }

        // Kiểm tra các trường bắt buộc
        const errors = [];
        if (!order.placer.name) errors.push('Tên người đặt hàng là bắt buộc.');
        if (!order.placer.phone) errors.push('Số điện thoại người đặt hàng là bắt buộc.');
        if (!order.address.district) errors.push('Quận/Huyện là bắt buộc.');
        if (!order.address.ward) errors.push('Phường/Xã là bắt buộc.');
        if (!order.address.details) errors.push('Địa chỉ chi tiết là bắt buộc.');
        if (!order.time.day) errors.push('Ngày giao hàng là bắt buộc.');
        if (!order.time.time) errors.push('Thời gian giao hàng là bắt buộc.');

        // Nếu có lỗi
        if (errors.length > 0) {
            return res.status(400).json({ error: 'Thông tin đơn hàng chưa đầy đủ.', details: errors });
        }

        return res.status(200).json({ message: 'Thông tin đơn hàng hợp lệ.', order });
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server.', details: error.message });
    }
};
