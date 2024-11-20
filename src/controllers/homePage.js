import User from '../models/UserModel.js';  // Giả sử bạn có model User
import Cake from '../models/cakeModels.js';  // Giả sử bạn có model Cake
import Order from '../models/shoppingCartModels.js';  // Giả sử bạn có model Order
class home {
    async index(req, res) {
      try{
        try {
          // Lấy tổng số người dùng
          const totalUsers = await User.countDocuments();
  
          // Lấy tổng số bánh
          const totalCakes = await Cake.countDocuments();
  
          // Lấy tổng số đơn hàng
          const totalOrders = await Order.countDocuments();
  
          // Truyền dữ liệu vào view
          res.render('homePage', {
              totalUsers,
              totalCakes,
              totalOrders
            });
            // res.render('homePage')
      } catch (error) {
          console.error('Error fetching dashboard stats:', error);
          res.status(500).json({ message: 'Server error', error });
      }
      }catch(err){
        res.status(500).json({error:err})
      }
    }

  }
  
export default new home();