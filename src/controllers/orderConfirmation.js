import OrderConfirmation from '../models/orderConfirmationModels.js';

export const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderConfirmation.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error });
    }
};

export const createOrder = async (req, res) => {
    const { placers, receivers, addresss, bills, times } = req.body;
    try {
        const newOrder = new OrderConfirmation({ placers, receivers, addresss, bills, times });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await OrderConfirmation.findById(req.params.id);
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving order', error });
    }
};