import Accessory from '../models/accessoryModels.js';

export const getAllAccessories = async (req, res) => {
    try {
        const accessories = await Accessory.find();
        res.status(200).json(accessories);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving accessories', error });
    }
};

export const createAccessory = async (req, res) => {
    const { image, name, price, code } = req.body;
    try {
        const newAccessory = new Accessory({ image, name, price, code });
        await newAccessory.save();
        res.status(201).json(newAccessory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating accessory', error });
    }
};

export const getAccessoryById = async (req, res) => {
    try {
        const accessory = await Accessory.findById(req.params.id);
        if (accessory) {
            res.status(200).json(accessory);
        } else {
            res.status(404).json({ message: 'Accessory not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving accessory', error });
    }
};
