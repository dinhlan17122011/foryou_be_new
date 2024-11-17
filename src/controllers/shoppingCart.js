import ShoppingCart from '../models/shoppingCartModels.js';

export const getAllCartItems = async (req, res) => {
    try {
        const cartItems = await ShoppingCart.find();
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart items', error });
    }
};

export const addItemToCart = async (req, res) => {
    const { image, price, quantity, totalPrice, writingcake } = req.body;
    try {
        const newCartItem = new ShoppingCart({ image, price, quantity, totalPrice, writingcake });
        await newCartItem.save();
        res.status(201).json(newCartItem);
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error });
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