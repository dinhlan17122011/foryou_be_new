import Accessory from '../models/accessoryModels.js';

export const getAccessories = async (req, res) => {
    try {
        // Lấy danh sách accessories từ database
        const accessories = await Accessory.find();
        // console.log('Accessories:', accessories); // Kiểm tra dữ liệu

        // Truyền biến accessories vào EJS
        res.render('managerAccessory', { accessories });
    } catch (error) {
        console.error('Error fetching accessories:', error);
        res.status(500).send('Internal Server Error');
    }
};


export const add = (req, res) => {
    try {
        res.render('addAccessory', { title: 'Add New Accessory' });
    } catch (error) {
        console.error('Error rendering page:', error);
        res.status(500).send('Internal Server Error');
    }
};


export const createAccessory = async (req, res) => {
    const { image, name, price, code } = req.body;
    try {
        const newAccessory = new Accessory({ image, name, price, code });
        await newAccessory.save();
        // res.status(201).json(newAccessory);
        res.redirect('/accessories');

    } catch (error) {
        res.status(500).json({ message: 'Error creating accessory', error });
    }
};

export const updateAccessory = async (req, res) => {
    const { id } = req.params; // Lấy id từ URL
    const { image, name, price, code } = req.body; // Lấy dữ liệu từ form

    try {
        // Tìm và cập nhật phụ kiện theo ID
        const updatedAccessory = await Accessory.findByIdAndUpdate(
            id,
            { image, name, price, code },
            { new: true, runValidators: true } // Trả về bản ghi đã cập nhật
        );

        if (!updatedAccessory) {
            return res.status(404).send('Accessory not found');
        }

        // Chuyển hướng về trang quản lý phụ kiện
        res.redirect('/accessories');
    } catch (error) {
        console.error('Error updating accessory:', error);
        res.status(500).send('Error updating accessory');
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the accessory by ID from the database
        const accessory = await Accessory.findById(id);

        // If the accessory is not found, return a 404 error
        if (!accessory) {
            return res.status(404).send('Accessory not found');
        }

        // Pass the accessory object to the view
        res.render('updateAccessory', { accessory });  // Pass accessory here
    } catch (error) {
        console.error('Error fetching accessory for update:', error);
        res.status(500).send('Internal Server Error');
    }
};


export const deleteAccessory = async (req, res) => {
    const { id } = req.params; // Lấy id từ URL

    try {
        // Tìm và xóa phụ kiện theo ID
        const deletedAccessory = await Accessory.findByIdAndDelete(id);

        if (!deletedAccessory) {
            return res.status(404).send('Accessory not found');
        }

        // Chuyển hướng về trang quản lý phụ kiện
        res.redirect('/accessories');
    } catch (error) {
        console.error('Error deleting accessory:', error);
        res.status(500).send('Error deleting accessory');
    }
};
