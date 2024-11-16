import CakeModel, { findByIdAndUpdate, find } from '../models/cakeModels';

// Thêm bánh mới
export async function addCake(req, res) {
    try {
        const { name, price, description } = req.body;
        const newCake = new CakeModel({ name, price, description });
        await newCake.save();
        res.redirect('/managerCakes');
    } catch (error) {
        res.status(500).send('Lỗi khi thêm bánh mới');
    }
}

// Cập nhật bánh
export async function updateCake(req, res) {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;
        await findByIdAndUpdate(id, { name, price, description });
        res.redirect('/managerCakes');
    } catch (error) {
        res.status(500).send('Lỗi khi cập nhật bánh');
    }
}

// Quản lý bánh
export async function getCakes(req, res) {
    try {
        const cakes = await find();
        res.render('managerCake', { cakes });
    } catch (error) {
        res.status(500).send('Lỗi khi lấy danh sách bánh');
    }
}
