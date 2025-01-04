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
      address: { district: '', ward: '', details: '' }
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
    const orderId = req.params.id; // Lấy ID đơn hàng từ URL
    const { Accessory } = req.body; // Thông tin phụ kiện từ body

    // Kiểm tra nếu phụ kiện không hợp lệ
    if (!Array.isArray(Accessory) || Accessory.length === 0) {
      return res.status(400).json({ message: 'Thông tin phụ kiện không hợp lệ' });
    }

    // Tính tổng tiền các phụ kiện
    const accessoryTotal = Accessory.reduce((sum, acc) => sum + (acc.number * acc.quantity), 0);

    // Tính toán tổng tiền (bao gồm tiền ship 30k)
    const order = await OrderConfirmation.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Cập nhật đơn hàng với phụ kiện
    order.Accessory = Accessory;
    order.totalAmount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + accessoryTotal + 30000; // 30000 là tiền ship

    // Lưu thay đổi
    await order.save();

    res.status(200).json({
      message: 'Thêm phụ kiện vào đơn hàng thành công',
      order
    });
  } catch (error) {
    console.error('Lỗi khi thêm phụ kiện vào đơn hàng:', error);
    res.status(500).json({ message: 'Thêm phụ kiện thất bại', error });
  }
};

// Bước 3: Cập nhật thông tin khách hàng và xác thực đơn hàng
export const updateOrderConfirmation = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { placer, receiver, address, time, bill } = req.body;

    // Kiểm tra nếu thiếu thông tin cần thiết
    if (!placer || !receiver || !address) {
      return res.status(400).json({ message: 'Thông tin đặt hàng không hợp lệ' });
    }

    const order = await OrderConfirmation.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Cập nhật thông tin khách hàng
    order.placer = placer;
    order.receiver = receiver;
    order.address = address;
    order.time = time;
    order.bill = bill; // Cập nhật thông tin thanh toán

    // Nếu người nhận giống với người đặt, sao chép thông tin từ placer sang receiver
    if (receiver.similarToAbove) {
      order.receiver.name = order.placer.name;
      order.receiver.phone = order.placer.phone;
    }

    // Lưu thông tin cập nhật
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

// Bước 4: Xác nhận và hoàn tất đơn hàng
export const finalizeOrderConfirmation = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { bill } = req.body;

    const order = await OrderConfirmation.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Cập nhật lại thông tin thanh toán
    order.bill = bill;
    order.tickBill = true; // Đánh dấu đã thanh toán

    // Lưu đơn hàng sau khi thanh toán
    await order.save();

    res.status(200).json({
      message: 'Đơn hàng đã được xác nhận và thanh toán',
      order
    });
  } catch (error) {
    console.error('Lỗi khi xác nhận đơn hàng:', error);
    res.status(500).json({ message: 'Xác nhận đơn hàng thất bại', error });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy userId từ params

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