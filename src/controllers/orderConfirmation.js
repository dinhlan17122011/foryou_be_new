import OrderConfirmation from '../models/orderConfirmationModels.js';
import ShoppingCart from '../models/shoppingCartModels.js';

export const createOrder = async (req, res) => {
  const { userId, placers, receivers, addresss, bills, times } = req.body;
  
  try {
    // Lấy giỏ hàng của người dùng
    const cart = await ShoppingCart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty, cannot create order' });
    }

    // Tạo đơn hàng mới
    const newOrder = new OrderConfirmation({
      userId,
      placers,
      receivers,
      addresss,
      bills,
      times,
      products: cart.products,
    });

    await newOrder.save();

    // Xóa giỏ hàng sau khi tạo đơn hàng
    await ShoppingCart.deleteOne({ userId });

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

export const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await OrderConfirmation.findById(orderId).populate('products.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving order details', error });
  }
};
