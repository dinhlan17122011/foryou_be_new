import OrderConfirmation from '../models/orderConfirmationModel.js';
import ShoppingCart from '../models/shoppingCartModels.js';
import Invoice from '../models/InvoiceModels.js';

/**
 * Tạo đơn đặt hàng từ giỏ hàng.
 * @param {String} userId - ID của người dùng.
 * @param {Object} orderDetails - Thông tin đặt hàng.
 * @returns {Object} - Hóa đơn đã tạo.
 */
export const placeOrder = async (userId, orderDetails) => {
    // Lấy giỏ hàng của người dùng
    const cart = await ShoppingCart.findOne({ userId });
    if (!cart) {
        throw new Error('Giỏ hàng không tồn tại');
    }

    // Tạo hóa đơn từ thông tin giỏ hàng và chi tiết đặt hàng
    const invoice = new Invoice({
        userId,
        items: cart.products.map((p) => ({
            productId: p.productId,
            name: p.name,
            price: p.price,
            quantity: p.quantity,
            totalPrice: p.price * p.quantity,
        })),
        totalAmount: cart.totalPrice,
        status: 'processing',
        placer: orderDetails.placer,
        receiver: orderDetails.receiver,
        address: orderDetails.address,
        billInfo: orderDetails.billInfo,
        deliveryTime: orderDetails.deliveryTime,
    });

    // Lưu hóa đơn
    await invoice.save();

    // Xóa giỏ hàng sau khi đặt hàng thành công
    await ShoppingCart.deleteOne({ userId });

    return invoice;
};

/**
 * Lấy thông tin đơn hàng.
 * @param {String} invoiceId - ID của hóa đơn.
 * @returns {Object|null} - Thông tin hóa đơn.
 */
export const getOrderDetails = async (invoiceId) => {
    return await Invoice.findById(invoiceId).populate('items.productId');
};
