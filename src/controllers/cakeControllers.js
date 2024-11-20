// controllers/cakeControllers.js
import CakeModel from '../models/cakeModels.js';
import CategoryModel from '../models/CategoryModels.js';
import mongoose from 'mongoose';

// Get list of cakes
export async function getCakes(req, res) {
    try {
        const cakes = await CakeModel.find();
        res.render('managerCake', { cakes });
    } catch (error) {
        res.status(500).send('Error fetching cake list');
        console.error('Error fetching cakes:', error);
    }
}

// Add a new cake
export async function addCake(req, res) {
    try {
        const { name, price, describe, image, category, code, newCategory, size = [] } = req.body;

        let categoryId;

        // Kiểm tra nếu tạo mới thể loại
        if (category === 'new' && newCategory) {
            const newCategoryDoc = new CategoryModel({ name: newCategory });
            const savedCategory = await newCategoryDoc.save();
            categoryId = savedCategory._id; // Lấy ID của thể loại mới tạo
        } else {
            // Sử dụng thể loại có sẵn
            categoryId = mongoose.Types.ObjectId.isValid(category) ? category : null;
        }

        if (!categoryId) {
            return res.status(400).send('Invalid category');
        }

        const formattedSizes = Array.isArray(size)
            ? size.map(entry => ({
                  image: entry.image || '',
                  price: parseFloat(entry.price) || 0,
                  size: entry.size || '',
              }))
            : [];

        const newCake = new CakeModel({
            name,
            price: parseFloat(price),
            describe,
            image,
            category: categoryId, // Gán ID thể loại
            code,
            size: formattedSizes,
        });

        await newCake.save();
        res.redirect('/cake');
    } catch (error) {
        console.error('Error adding new cake:', error);
        res.status(500).send('Error adding new cake');
    }
}

export async function add(req, res) {
    try {
        const categories = await CategoryModel.find(); // Lấy danh sách thể loại
        res.render('addCake', { categories }); // Truyền danh sách thể loại vào view
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Error loading form');
    }
}

// Update cake information
export async function updateCake(req, res) {
    try {
        const { id } = req.params; // Lấy id từ URL
        const { name, price, description } = req.body; // Lấy dữ liệu từ form
        await CakeModel.findByIdAndUpdate(id, { name, price, description });
        res.redirect('/cake'); // Quay lại trang quản lý
    } catch (error) {
        res.status(500).send('Error updating cake');
        console.error('Error:', error);
    }
}

export async function update(req, res) {
    try {
        const { id } = req.params; // Lấy id từ URL
        const cake = await CakeModel.findById(id); // Tìm cake theo id
        if (!cake) {
            return res.status(404).send('Cake not found');
        }
        res.render('updateCake', { cake }); // Gửi dữ liệu cake để hiển thị
    } catch (error) {
        res.status(500).send('Error fetching cake for update');
        console.error('Error:', error);
    }
}


// Delete a cake
export async function deleteCake(req, res) {
    try {
        const { id } = req.params;
        await CakeModel.findByIdAndDelete(id);
        res.redirect('/cake');
    } catch (error) {
        res.status(500).send('Error deleting cake');
    }
}

// Xem chi tiết bánh
export async function viewCake(req, res) {
    try {
        const { id } = req.params;  // Lấy ID của bánh từ URL
        const cake = await CakeModel.findById(id).populate('category'); // Tìm bánh theo ID và đưa vào thông tin thể loại nếu có
        
        if (!cake) {
            return res.status(404).send('Cake not found');
        }

        // Gửi dữ liệu cake ra view
        res.render('viewCake', { cake });
    } catch (error) {
        res.status(500).send('Error fetching cake details');
        console.error('Error:', error);
    }
}
