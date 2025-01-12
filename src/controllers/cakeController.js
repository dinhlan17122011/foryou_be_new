import Cake from '../models/cakeModels.js';

// Lấy tất cả bánh
export const getCakes = async (req, res) => {
    try {
        const cakes = await Cake.find().populate('category'); // Populate thông tin category
        res.status(200).json(cakes);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error })
    }
};

// Lấy thông tin một bánh theo ID
export const getCakeById = async (req, res) => {
    try {
        const { id } = req.params;
        const cake = await Cake.findById(id).populate('category');
        if (!cake) {
            return res.status(404).json({ message: 'Không tìm thấy bánh' });
        }
        res.status(200).json(cake);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Thêm một bánh mới
export const createCake = async (req, res) => {
    try {
        const { name, size, describe, category, code } = req.body;

        // Kiểm tra thiếu dữ liệu
        if (!name || !size || !describe || !category || !code) {
            return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
        }

        // Tạo mới tài liệu
        const newCake = new Cake({
            name,
            size,
            describe,
            category,
            code,
        });

        const savedCake = await newCake.save();
        res.status(201).json(savedCake);
    } catch (error) {
        console.error('Lỗi khi tạo bánh:', error);
        res.status(500).json({ message: "Lỗi server" });
    }
};


// Cập nhật thông tin bánh
export const updateCake = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCake = await Cake.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCake) {
            return res.status(404).json({ message: 'Không tìm thấy bánh để cập nhật' });
        }
        res.status(200).json(updatedCake);
    } catch (error) {
        res.status(400).json({ message: 'Cập nhật thất bại', error });
    }
};

// Xóa bánh
export const deleteCake = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCake = await Cake.findByIdAndDelete(id);
        if (!deletedCake) {
            return res.status(404).json({ message: 'Không tìm thấy bánh để xóa' });
        }
        res.status(200).json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};