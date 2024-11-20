import ShoppingCart from '../models/shoppingCartModels.js';
import OrderConfirmation from '../models/orderConfirmationModels.js';
import Invoice from '../models/InvoiceModels.js';

export const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id; // Lấy ID người dùng hiện tại
        
        // Lấy thông tin từ ShoppingCart và OrderConfirmation
        const cart = await ShoppingCart.findOne({ userId });
        const order = await OrderConfirmation.findOne({ userId });
        
        if (!cart || !order) {
            return res.status(400).json({ message: 'Cart or order data not found' });
        }
        
        // Hợp nhất dữ liệu
        const invoiceData = {
            userId,
            items: cart.items,
            totalAmount: cart.totalCartPrice,
            placer: order.placer,
            receiver: order.receiver,
            address: order.address,
            billInfo: order.bill,
            deliveryTime: order.time,
        };
        
        // Tạo hóa đơn
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

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id; // Lấy ID người dùng hiện tại
        
        // Tìm tất cả đơn hàng của người dùng
        const orders = await Invoice.find({ userId });
        
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body; // Lấy trạng thái từ body (ví dụ: "processing", "shipped", "delivered")
        
        // Kiểm tra trạng thái hợp lệ (tùy vào hệ thống của bạn)
        const validStatuses = ['processing', 'shipped', 'delivered', 'canceled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        // Cập nhật trạng thái đơn hàng
        const order = await Invoice.findByIdAndUpdate(orderId, { status }, { new: true });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status', error });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        // Tìm đơn hàng theo ID
        const order = await Invoice.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Kiểm tra xem trạng thái đơn hàng có cho phép hủy không (ví dụ: không thể hủy nếu đã giao hàng)
        if (order.status === 'shipped' || order.status === 'delivered') {
            return res.status(400).json({ message: 'Cannot cancel this order' });
        }

        // Hủy đơn hàng
        await Invoice.findByIdAndDelete(orderId);
        
        res.status(200).json({ message: 'Order canceled successfully' });
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ message: 'Error canceling order', error });
    }
};

export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Lấy thông tin đơn hàng theo ID
        const order = await Invoice.findById(orderId).populate('userId').populate('items.productId');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Error fetching order details', error });
    }
};
