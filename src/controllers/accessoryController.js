import Accessory from '../models/accessoryModels.js';

// Tạo mới phụ kiện
export const createAccessory = async (req, res) => {
    try {
        console.log(req.body); // Kiểm tra dữ liệu nhận được
        const { image, name, describe, price, code } = req.body;

        if (!image || !name || !price || !code) {
            return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
        }

        const newAccessory = new Accessory({
            image,
            name,
            describe,
            price,
            code,
        });

        const savedAccessory = await newAccessory.save();
        res.status(201).json(savedAccessory);
    } catch (error) {
        console.error('Lỗi khi tạo phụ kiện:', error);
        res.status(500).json({ message: "Lỗi server" });
    }
};


// Lấy danh sách phụ kiện
export const getAccessories = async (req, res) => {
    try {
        const accessories = await Accessory.find();
        res.status(200).json(accessories);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phụ kiện:', error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Lấy thông tin chi tiết phụ kiện theo ID
export const getAccessoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const accessory = await Accessory.findById(id);

        if (!accessory) {
            return res.status(404).json({ message: "Không tìm thấy phụ kiện" });
        }

        res.status(200).json(accessory);
    } catch (error) {
        console.error('Lỗi khi lấy thông tin phụ kiện:', error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Cập nhật thông tin phụ kiện
export const updateAccessory = async (req, res) => {
    try {
        const { id } = req.params;
        const { image, name, describe, price, code } = req.body;

        const updatedAccessory = await Accessory.findByIdAndUpdate(
            id,
            { image, name, describe, price, code },
            { new: true, runValidators: true }
        );

        if (!updatedAccessory) {
            return res.status(404).json({ message: "Không tìm thấy phụ kiện" });
        }

        res.status(200).json(updatedAccessory);
    } catch (error) {
        console.error('Lỗi khi cập nhật phụ kiện:', error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Xóa phụ kiện
export const deleteAccessory = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAccessory = await Accessory.findByIdAndDelete(id);

        if (!deletedAccessory) {
            return res.status(404).json({ message: "Không tìm thấy phụ kiện" });
        }

        res.status(200).json({ message: "Xóa phụ kiện thành công" });
    } catch (error) {
        console.error('Lỗi khi xóa phụ kiện:', error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
