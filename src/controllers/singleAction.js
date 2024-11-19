import ShoppingCart from '../models/shoppingCartModel.js';
import OrderConfirmation from '../models/orderConfirmationModel.js';
import Invoice from '../models/invoiceModel.js';

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
