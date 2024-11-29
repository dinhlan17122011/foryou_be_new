// controllers/cakeControllers.js
import CakeModel from '../models/cakeModels.js';
import CategoryModel from '../models/CategoryModels.js';
import mongoose from 'mongoose';

// Get list of cakes
export async function getCakes(req, res) {
    try {
        const cakes = await CakeModel.find();//Truy vấn tất cả dữ liệu từ collection cakes
        res.render('managerCake', { cakes });//Truyền danh sách bánh (cakes) vào view managerCake để hiển thị.
    } catch (error) {
        res.status(500).send('Error fetching cake list');
        console.error('Error fetching cakes:', error);
    }
}

export async function addCake(req, res) {
    try {
        const { name, price, describe, image, category, code, newCategory, size = [] } = req.body;

        let categoryId;

        const banhName = req.body.name; // Lấy tên bánh từ form
        req.flash('success', `Bánh "${banhName}" đã được thêm thành công!`);
        
        if (category === 'new' && newCategory) {
            const newCategoryDoc = new CategoryModel({ name: newCategory });
            const savedCategory = await newCategoryDoc.save();
            categoryId = savedCategory._id;
        } else {
            categoryId = mongoose.Types.ObjectId.isValid(category) ? category : null;
        }

        if (!categoryId) {
            req.flash('error', 'Invalid category');
            return res.redirect('/cake/add');
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
            category: categoryId,
            code,
            size: formattedSizes,
        });

        await newCake.save();
        req.flash('success', `Đã thêm bánh "${name}" thành công!`);
        res.redirect('/cake');
    } catch (error) {
        console.error('Error adding new cake:', error);
        req.flash('error', 'Có lỗi xảy ra khi thêm bánh');
        res.redirect('/cake/add');
    }
}


export async function add(req, res) {
    try {
        //CategoryModel.find(): Lấy tất cả thể loại từ collection categories.
        const categories = await CategoryModel.find(); // Lấy danh sách thể loại
        //Truyền dữ liệu categories vào view addCake.
        res.render('addCake', { categories }); // Truyền danh sách thể loại vào view
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Error loading form');
    }
}

// Update cake information
export async function updateCake(req, res) {
    try {
        //findByIdAndUpdate: Tìm bánh theo ID và cập nhật các trường name, price, description.
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
    //Xóa một bánh khỏi database dựa vào ID.
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
