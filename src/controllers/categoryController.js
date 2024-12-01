import Category from '../models/CategoryModels.js';

// Tạo mới thể loại bánh
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!name) {
            return res.status(400).json({ message: "Tên thể loại không được để trống" });
        }

        // Kiểm tra xem thể loại đã tồn tại chưa
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Thể loại này đã tồn tại" });
        }

        // Tạo thể loại mới
        const newCategory = new Category({ name });
        const savedCategory = await newCategory.save();

        res.status(201).json({ message: "Thể loại bánh được tạo thành công", category: savedCategory });
    } catch (error) {
        console.error("Lỗi khi tạo thể loại bánh:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Lấy danh sách tất cả thể loại bánh
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách thể loại bánh:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Cập nhật thể loại bánh
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!name) {
            return res.status(400).json({ message: "Tên thể loại không được để trống" });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Không tìm thấy thể loại" });
        }

        res.status(200).json({ message: "Cập nhật thể loại thành công", category: updatedCategory });
    } catch (error) {
        console.error("Lỗi khi cập nhật thể loại bánh:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Xóa thể loại bánh
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: "Không tìm thấy thể loại" });
        }

        res.status(200).json({ message: "Xóa thể loại thành công", category: deletedCategory });
    } catch (error) {
        console.error("Lỗi khi xóa thể loại bánh:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
