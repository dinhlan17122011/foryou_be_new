import ShoppingCart from '../models/shoppingCartModels.js';

// Kiểm tra giỏ hàng trước khi đặt hàng
const checkShoppingCart = async (req, res, next) => {
    const { userId } = req.body;

    try {
        const shoppingCart = await ShoppingCart.findOne({ userId });

        if (!shoppingCart || shoppingCart.products.length === 0) {
            return res.status(404).json({ message: "Giỏ hàng trống" });
        }

        req.shoppingCart = shoppingCart; // Đính kèm giỏ hàng vào request để sử dụng sau
        next(); // Tiếp tục xử lý
    } catch (error) {
        console.error("Lỗi kiểm tra giỏ hàng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

export default checkShoppingCart;
