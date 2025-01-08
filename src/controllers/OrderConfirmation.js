import { Model } from 'mongoose';
import OrderConfirmation from '../models/orderConfirmationModels.js'; // Import model OrderConfirmation

// Bước 1: Tạo đơn hàng trống
export const createOrderConfirmation = async (req, res) => {
  try {
    const { userId, items } = req.body;

    // Kiểm tra nếu thông tin items không hợp lệ
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Thông tin bánh không hợp lệ' });
    }

    // Tạo một đơn hàng trống với thông tin bánh
    const newOrder = new OrderConfirmation({
      userId,
      items,
      Accessory: [], // Mảng phụ kiện trống
      bill: { tickBill: false }, // Đánh dấu là chưa thanh toán
      time: { day: '', time: '' },
      placer: { name: '', phone: '' },
      receiver: { similarToAbove: false, name: '', phone: '' },
      address: { district: '', ward: '', details: '' },
      totalAmount: 0, // Tổng số tiền ban đầu
      status: 'pending', // Trạng thái đơn hàng ban đầu là 'pending'
    });

    // Lưu đơn hàng
    await newOrder.save();

    res.status(201).json({
      message: 'Đơn hàng trống đã được tạo',
      order: newOrder
    });
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    res.status(500).json({ message: 'Tạo đơn hàng thất bại', error });
  }
};

// Bước 2: Thêm phụ kiện vào đơn hàng
export const addAccessoriesToOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { Accessory } = req.body;

    // Kiểm tra dữ liệu phụ kiện có hợp lệ không
    if (!Array.isArray(Accessory) || Accessory.length === 0) {
      return res.status(400).json({ message: 'Thông tin phụ kiện không hợp lệ' });
    }

    // Kiểm tra từng phụ kiện
    for (const acc of Accessory) {
      if (!acc.number || !acc.quantity) {
        return res.status(400).json({ message: 'Thiếu thông tin phụ kiện' });
      }
    }

    // Tính tổng số tiền của phụ kiện
    const accessoryTotal = Accessory.reduce((sum, acc) => {
      // Kiểm tra số lượng và giá trị phụ kiện hợp lệ trước khi tính
      if (isNaN(acc.price) || isNaN(acc.quantity)) {
        return sum;  // Không tính nếu giá trị không hợp lệ
      }
      return sum + (acc.price * acc.quantity);
    }, 0);

    if (accessoryTotal === 0) {
      return res.status(400).json({ message: 'Có phụ kiện không hợp lệ' });
    }

    // Tìm đơn hàng theo id
    const order = await OrderConfirmation.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Cập nhật phụ kiện vào đơn hàng
    order.Accessory = Accessory;

    // Tính tổng số tiền của đơn hàng (bao gồm cả phụ kiện và các item khác)
    const shippingFee = 30000; // Phí vận chuyển cố định
    order.totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + accessoryTotal + shippingFee;

    // Lưu lại đơn hàng với các thay đổi
    await order.save();

    res.status(200).json({ message: 'Thêm phụ kiện vào đơn hàng thành công', order });
  } catch (error) {
    console.error('Lỗi khi thêm phụ kiện vào đơn hàng:', error);  // Log lỗi chi tiết
    res.status(500).json({ message: 'Thêm phụ kiện thất bại', error: error.message });
  }
};

// Bước 3: Cập nhật thông tin khách hàng và xác thực đơn hàng
export const updateOrderConfirmation = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { placer, receiver, address, time, bill } = req.body;

    // Kiểm tra nếu thiếu thông tin
    if (!placer || !receiver || !address) {
      return res.status(400).json({ message: 'Thông tin đơn hàng không hợp lệ' });
    }

    const order = await OrderConfirmation.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Cập nhật thông tin đơn hàng
    order.placer = placer;
    order.receiver = receiver;
    order.address = address;
    order.time = time;
    order.bill = bill;

    // Nếu người nhận giống người đặt, sao chép thông tin
    if (receiver.similarToAbove) {
      order.receiver.name = order.placer.name;
      order.receiver.phone = order.placer.phone;
    }

    await order.save();

    res.status(200).json({
      message: 'Cập nhật đơn hàng thành công',
      order
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật đơn hàng:', error);
    res.status(500).json({ message: 'Cập nhật đơn hàng thất bại', error });
  }
};

// Lấy danh sách đơn hàng theo userId
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy userId từ params

    // Kiểm tra xem userId có hợp lệ không
    if (!userId || userId === 'null') {
      return res.status(400).json({ message: 'userId không hợp lệ. Vui lòng đăng nhập.' });
    }

    // Tìm tất cả các đơn hàng của userId
    const orders = await OrderConfirmation.find({ userId });

    // Nếu không có đơn hàng nào
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: 'Người dùng này chưa có đơn hàng nào.'
      });
    }

    // Trả về danh sách đơn hàng
    res.status(200).json({
      message: 'Danh sách đơn hàng của người dùng:',
      orders
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({ message: 'Không thể lấy danh sách đơn hàng.', error });
  }
};

// Bước 4: Cập nhật trạng thái đơn hàng khi thanh toán
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (status !== 'paid' && status !== 'cancelled') {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const order = await OrderConfirmation.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: 'Cập nhật trạng thái đơn hàng thành công',
      order
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({ message: 'Cập nhật trạng thái đơn hàng thất bại', error });
  }
};

// Bước 5: Xóa đơn hàng
export const deleteOrderConfirmation = async (req, res) => {
  try {
    const orderId = req.params.id; // Lấy ID đơn hàng từ URL

    // Tìm và xóa đơn hàng
    const deletedOrder = await OrderConfirmation.findByIdAndDelete(orderId);

    // Nếu không tìm thấy đơn hàng
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng để xóa' });
    }

    res.status(200).json({
      message: 'Đơn hàng đã được xóa thành công',
      deletedOrder
    });
  } catch (error) {
    console.error('Lỗi khi xóa đơn hàng:', error);
    res.status(500).json({ message: 'Xóa đơn hàng thất bại', error });
  }
};

// API cập nhật trạng thái sản phẩm
// API cập nhật trạng thái sản phẩm
export const updateProductStatus = async (req, res) => {
  const { orderId, status } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!orderId || !status) {
    return res.status(400).json({ message: 'Thiếu orderId hoặc trạng thái (status)' });
  }

  // Chỉ cho phép các trạng thái hợp lệ
  const validStatuses = ['available', 'sold', 'pending', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }

  try {
    // Tìm đơn hàng theo orderId
    const order = await OrderConfirmation.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Cập nhật trạng thái cho đơn hàng
    order.status = status;
    await order.save();

    // Nếu trạng thái là "sold", cập nhật trạng thái sản phẩm liên quan
    if (status === 'sold' && order.items && order.items.length > 0) {
      const updateProductsStatus = async (items, productStatus) => {
        const promises = items.map((itemId) =>
          OrderConfirmation.findByIdAndUpdate(itemId, { status: productStatus }, { new: true })
        );
        await Promise.all(promises); // Thực thi tất cả cập nhật song song
      };

      await updateProductsStatus(order.items, 'sold');
    }

    // Trả về kết quả thành công
    res.status(200).json({
      message: `Cập nhật trạng thái thành công: ${status}`,
      order,
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);

    res.status(500).json({
      message: 'Cập nhật trạng thái thất bại',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};