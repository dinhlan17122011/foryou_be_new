import ShoppingCart from '../models/shoppingCartModels.js';
// import User from '../models/userModel.js';

export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  
  try {
    // Kiểm tra xem giỏ hàng đã có sản phẩm chưa
    let cart = await ShoppingCart.findOne({ userId });

    if (!cart) {
      // Nếu chưa có giỏ hàng, tạo mới
      cart = new ShoppingCart({
        userId,
        products: [{ productId, quantity }]
      });
    } else {
      // Nếu có giỏ hàng rồi, thêm sản phẩm vào
      const existingProduct = cart.products.find(item => item.productId === productId);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

export const getCart = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const cart = await ShoppingCart.findOne({ userId }).populate('products.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving cart', error });
  }
};

export const updateCart = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await ShoppingCart.findOne({ 'products._id': itemId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const product = cart.products.id(itemId);
    product.quantity = quantity;

    await cart.save();
    res.status(200).json({ message: 'Cart updated', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error });
  }
};

export const removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    const cart = await ShoppingCart.findOne({ 'products._id': itemId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products.pull(itemId);
    await cart.save();
    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product from cart', error });
  }
};
