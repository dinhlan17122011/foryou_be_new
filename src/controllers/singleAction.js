import ShoppingCart from '../models/shoppingCartModels.js';
import OrderConfirmation from '../models/orderConfirmationModels.js';
import Invoice from '../models/InvoiceModels.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';


export const printOrder = async (req, res) => {
        try {
            const { invoiceId } = req.params;
    
            // Tìm hóa đơn theo ID
            const invoice = await Invoice.findById(invoiceId);
            if (!invoice) {
                return res.status(404).json({ message: 'Invoice not found' });
            }
    
            // Tạo PDF
            const doc = new PDFDocument();
            doc.pipe(res);
    
            // Tiêu đề
            doc.fontSize(20).text('Hóa Đơn', { align: 'center' });
            doc.moveDown();
    
            // Thông tin người mua
            doc.fontSize(12).text(`Người mua: ${invoice.placer.name} - ${invoice.placer.phone}`);
            doc.text(`Địa chỉ: ${invoice.address.district}, ${invoice.address.ward}`);
            doc.text(`Thời gian giao hàng: ${invoice.deliveryTime}`);
    
            // Dữ liệu sản phẩm
            doc.text('Sản phẩm:');
            invoice.items.forEach(item => {
                doc.text(`${item.name} - ${item.quantity} x ${item.price} VNĐ = ${item.totalPrice} VNĐ`);
            });
    
            // Tổng tiền
            doc.moveDown();
            doc.text(`Tổng cộng: ${invoice.totalAmount} VNĐ`);
    
            // Kết thúc
            doc.end();
    
        } catch (error) {
            console.error('Error printing invoice:', error);
            res.status(500).json({ message: 'Error printing invoice', error });
        }
};

/**
 * Thêm sản phẩm vào giỏ hàng và cập nhật thông tin xác nhận đơn hàng.
 */
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id; // ID người dùng hiện tại
        const { productId, quantity, price } = req.body; // Thông tin sản phẩm

        // Thêm sản phẩm vào giỏ hàng
        const cart = await ShoppingCart.findOneAndUpdate(
            { userId },
            {
                $push: {
                    products: { productId, quantity, price },
                },
                $inc: { totalPrice: price * quantity }, // Tính tổng giá trị
            },
            { new: true, upsert: true } // Tạo mới nếu không tồn tại
        );

        // Tạo hoặc cập nhật thông tin OrderConfirmation
        await OrderConfirmation.findOneAndUpdate(
            { userId },
            {
                userId,
                placer: { name: req.user.name, phone: req.user.phone },
            },
            { upsert: true } // Tạo mới nếu không tồn tại
        );

        res.status(201).json({ message: 'Added to cart and updated order info', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Error adding to cart', error });
    }
};

/**
 * Cập nhật thông tin xác nhận đơn hàng.
 */
export const confirmOrderInfo = async (req, res) => {
    try {
        const userId = req.user._id; // ID người dùng hiện tại
        const { receiver, address, bill, time } = req.body;

        // Cập nhật thông tin người nhận, địa chỉ và thời gian giao hàng
        const orderConfirmation = await OrderConfirmation.findOneAndUpdate(
            { userId },
            { receiver, address, bill, time },
            { new: true }
        );

        if (!orderConfirmation) {
            return res.status(404).json({ message: 'Order confirmation not found' });
        }

        res.status(200).json({ message: 'Order info confirmed', orderConfirmation });
    } catch (error) {
        console.error('Error confirming order info:', error);
        res.status(500).json({ message: 'Error confirming order info', error });
    }
};

/**
 * Gộp dữ liệu giỏ hàng và xác nhận đơn hàng thành hóa đơn.
 */
export const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id; // ID người dùng hiện tại

        // Lấy dữ liệu từ giỏ hàng và xác nhận đơn hàng
        const cart = await ShoppingCart.findOne({ userId });
        const order = await OrderConfirmation.findOne({ userId });

        if (!cart || !order) {
            return res.status(400).json({ message: 'Cart or order confirmation not found' });
        }

        // Tạo dữ liệu hóa đơn
        const invoiceData = {
            userId,
            items: cart.products.map((product) => ({
                productId: product.productId,
                name: product.name,
                price: product.price,
                quantity: product.quantity,
                totalPrice: product.price * product.quantity,
            })),
            totalAmount: cart.totalPrice,
            status: 'processing',
            placer: order.placer,
            receiver: order.receiver,
            address: order.address,
            billInfo: order.bill,
            deliveryTime: order.time,
        };

        // Lưu hóa đơn
        const invoice = new Invoice(invoiceData);
        await invoice.save();

        // Xóa dữ liệu tạm thời
        await ShoppingCart.deleteOne({ userId });
        await OrderConfirmation.deleteOne({ userId });

        res.status(201).json({ message: 'Order placed successfully', invoice });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Error placing order', error });
    }
};

/**
 * Lấy tất cả hóa đơn của người dùng.
 */
export const getInvoices = async (req, res) => {
    try {
        const userId = req.user._id; // ID người dùng từ middleware xác thực

        // Lấy các đơn hàng đã được gửi (có trạng thái là shipped hoặc delivered)
        const orders = await Invoice.find({ userId, status: { $in: ['shipped', 'delivered'] } })
            .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo (mới nhất lên đầu)

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No sent orders found' });
        }
        // Render view với các đơn hàng đã gửi
        res.render('sentOrders', { orders });
    } catch (error) {
        console.error('Error fetching sent orders:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id; // ID người dùng từ middleware xác thực

        // Tìm tất cả hóa đơn liên quan đến người dùng
        const orders = await Invoice.find({ userId }).sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json({ message: 'Orders retrieved successfully', orders });
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ message: 'Error retrieving orders', error });
    }
};


export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params; // Lấy ID đơn hàng từ URL

        // Tìm hóa đơn theo ID
        const order = await Invoice.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order details retrieved successfully', order });
    } catch (error) {
        console.error('Error retrieving order details:', error);
        res.status(500).json({ message: 'Error retrieving order details', error });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params; // Lấy ID đơn hàng từ URL
        const { status } = req.body; // Lấy trạng thái mới từ body

        const validStatuses = ['processing', 'shipped', 'delivered', 'canceled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        // Cập nhật trạng thái
        const order = await Invoice.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status', error });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params; // Lấy ID đơn hàng từ URL

        const order = await Invoice.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Kiểm tra xem đơn hàng có thể bị hủy không
        if (['shipped', 'delivered'].includes(order.status)) {
            return res.status(400).json({ message: 'Cannot cancel this order' });
        }

        await Invoice.findByIdAndDelete(orderId);

        res.status(200).json({ message: 'Order canceled successfully' });
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ message: 'Error canceling order', error });
    }
};
