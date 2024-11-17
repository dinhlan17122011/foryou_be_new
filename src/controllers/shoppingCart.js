import ShoppingCart from '../models/shoppingCartModels.js';

export const addItemToCart = async (req, res) => {
    const { userId, image, price, quantity, totalPrice, writingcake } = req.body;

    try {
        // Kiểm tra xem giỏ hàng của người dùng đã tồn tại chưa
        let cart = await ShoppingCart.findOne({ userId });

        // Nếu giỏ hàng đã tồn tại, thêm sản phẩm vào giỏ hàng
        if (cart) {
            // Kiểm tra nếu sản phẩm đã có trong giỏ hàng, nếu có thì cập nhật số lượng và tổng giá trị
            const existingItemIndex = cart.items.findIndex(item => item.writingcake === writingcake);
            if (existingItemIndex !== -1) {
                cart.items[existingItemIndex].quantity += quantity;
                cart.items[existingItemIndex].totalPrice = cart.items[existingItemIndex].quantity * price;
            } else {
                // Nếu sản phẩm chưa có trong giỏ, thêm sản phẩm mới
                cart.items.push({ image, price, quantity, totalPrice, writingcake });
            }
            cart.totalPrice = cart.items.reduce((total, item) => total + item.totalPrice, 0); // Cập nhật tổng tiền của giỏ hàng
            await cart.save();
            return res.status(200).json(cart);
        } else {
            // Nếu giỏ hàng chưa có, tạo giỏ hàng mới cho người dùng
            const newCart = new ShoppingCart({
                userId,
                items: [{ image, price, quantity, totalPrice, writingcake }],
                totalPrice: totalPrice,  // Tổng tiền của giỏ hàng mới
            });
            await newCart.save();
            return res.status(201).json(newCart);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error });
    }
};

export const getAllCartItems = async (req, res) => {
    try {
        const cartItems = await ShoppingCart.find();
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart items', error });
    }
};

export const getCartItemById = async (req, res) => {
    try {
        const cartItem = await ShoppingCart.findById(req.params.id);
        if (cartItem) {
            res.status(200).json(cartItem);
        } else {
            res.status(404).json({ message: 'Cart item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart item', error });
    }
};
