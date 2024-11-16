// import AccessoryModel, { find, findByIdAndUpdate } from '../models/accessoryModels.js';

// // Thêm phụ kiện mới
// export async function addAccessory(req, res) {
//     try {
//         const { name, price, description } = req.body;
//         const newAccessory = new AccessoryModel({ name, price, description });
//         await newAccessory.save();
//         res.redirect('/managerAccessories');
//     } catch (error) {
//         res.status(500).send('Lỗi khi thêm phụ kiện mới');
//     }
// }

// // Quản lý phụ kiện
// export async function getAccessories(req, res) {
//     try {
//         const accessories = await find();
//         res.render('managerAccessory', { accessories });
//     } catch (error) {
//         res.status(500).send('Lỗi khi lấy danh sách phụ kiện');
//     }
// }

// export async function updateAccessory(req, res) {
//     try {
//         const { id } = req.params;
//         const { name, price, description } = req.body;
//         await findByIdAndUpdate(id, { name, price, description });
//         res.redirect('/managerAccessories');
//     } catch (error) {
//         res.status(500).send('Lỗi khi cập nhật phụ kiện');
//     }
// }