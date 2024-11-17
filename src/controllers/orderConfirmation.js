import OrderConfirmation from '../models/orderConfirmationModels.js';
import ShoppingCart from '../models/shoppingCartModels.js';

export const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderConfirmation.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error });
    }
};


export const getOrderById = async (req, res) => {
    try {
        const order = await OrderConfirmation.findById(req.params.id);
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving order', error });
    }
};

export const confirmOrder = async (req, res) => {
    try {
        // Lấy thông tin giỏ hàng của người dùng (giả sử người dùng có `userId`)
        const cart = await ShoppingCart.findOne({ userId: req.body.userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng không có sản phẩm' });
        }

        // Tạo đơn hàng từ giỏ hàng
        const newOrder = new OrderConfirmation({
            customerName: req.body.customerName,
            items: cart.items,
            totalPrice: cart.totalPrice,
            date: new Date(),
            userId: req.body.userId,  // Liên kết đơn hàng với người dùng
            status: 'Đang xử lý',      // Trạng thái đơn hàng
        });

        // Lưu đơn hàng vào cơ sở dữ liệu
        await newOrder.save();

        // Xóa giỏ hàng sau khi đã xác nhận
        await ShoppingCart.deleteOne({ userId: req.body.userId });

        // Trả về thông tin đơn hàng
        res.status(201).json({
            message: 'Đơn hàng đã được xác nhận',
            order: newOrder,
        });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi xác nhận đơn hàng', error });
    }
};

export const printInvoice = async (req, res) => {
    try {
        const order = await OrderConfirmation.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Tạo một tài liệu PDF
        const doc = new PDFDocument();
        const invoicePath = path.join(__dirname, `../invoices/invoice_${order._id}.pdf`);
        doc.pipe(fs.createWriteStream(invoicePath));

        // Thêm thông tin vào hóa đơn
        doc.fontSize(20).text('Invoice', { align: 'center' });

        doc.fontSize(12).text(`Order ID: ${order._id}`, { align: 'left' });
        doc.text(`Customer: ${order.customerName}`, { align: 'left' });
        doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, { align: 'left' });

        doc.text('\nItems:', { align: 'left' });

        // Liệt kê các mặt hàng trong đơn hàng
        order.items.forEach(item => {
            doc.text(`${item.name} - Quantity: ${item.quantity} - Price: ${item.price}`);
        });

        // Tổng tiền
        doc.text(`\nTotal: ${order.totalPrice}`, { align: 'left' });

        // Kết thúc tài liệu PDF
        doc.end();

        // Sau khi tạo PDF, gửi file PDF về client
        doc.on('finish', () => {
            res.status(200).json({
                message: 'Invoice generated successfully',
                invoicePath: `/invoices/invoice_${order._id}.pdf`,
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating invoice', error });
    }
};