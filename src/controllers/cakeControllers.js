// controllers/cakeControllers.js
import CakeModel from '../models/cakeModels.js';

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
        const { name, price, describe } = req.body;
        const newCake = new CakeModel({ name, price, describe });
        await newCake.save();
        res.redirect('/cake');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error adding new cake');
    }
}

export function add(req,res){
    res.render('addCake');
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
