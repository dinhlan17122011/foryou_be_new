import ShoppingCart from '../models/shoppingCartModels.js';

/**
 * Thêm sản phẩm vào giỏ hàng.
 * @param {String} userId - ID của người dùng.
 * @param {Object} product - Sản phẩm cần thêm.
 * @returns {Object} - Giỏ hàng đã cập nhật.
 */
export const addToCart = async (userId, product) => {
    let cart = await ShoppingCart.findOne({ userId });

    if (!cart) {
        // Tạo giỏ hàng mới nếu chưa tồn tại
        cart = new ShoppingCart({
            userId,
            products: [product],
            totalPrice: product.price * product.quantity,
        });
    } else {
        // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
        const existingProduct = cart.products.find((p) => p.productId.toString() === product.productId);

        if (existingProduct) {
            // Cập nhật số lượng và giá
            existingProduct.quantity += product.quantity;
            existingProduct.price = product.price;
        } else {
            // Thêm sản phẩm mới vào giỏ
            cart.products.push(product);
        }

        // Cập nhật tổng giá trị giỏ hàng
        cart.totalPrice = cart.products.reduce((total, p) => total + p.price * p.quantity, 0);
    }

    // Lưu giỏ hàng
    await cart.save();
    return cart;
};

/**
 * Lấy giỏ hàng của người dùng.
 * @param {String} userId - ID của người dùng.
 * @returns {Object|null} - Giỏ hàng của người dùng.
 */
export const getCart = async (userId) => {
    return await ShoppingCart.findOne({ userId }).populate('products.productId');
};

/**
 * Xóa sản phẩm khỏi giỏ hàng.
 * @param {String} userId - ID của người dùng.
 * @param {String} productId - ID sản phẩm cần xóa.
 * @returns {Object} - Giỏ hàng đã cập nhật.
 */
export const removeFromCart = async (userId, productId) => {
    const cart = await ShoppingCart.findOne({ userId });

    if (!cart) {
        throw new Error('Giỏ hàng không tồn tại');
    }

    cart.products = cart.products.filter((p) => p.productId.toString() !== productId);

    // Cập nhật tổng giá trị
    cart.totalPrice = cart.products.reduce((total, p) => total + p.price * p.quantity, 0);

    await cart.save();
    return cart;
};
