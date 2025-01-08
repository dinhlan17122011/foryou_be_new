import { Schema as _Schema, model, mongoose } from 'mongoose';
const Schema = _Schema;

const itemSchema = new mongoose.Schema({
    namecake: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    code: { type: String, required: true },
    size: { type: String, required: true },
    notecake: { type: String},
});

const AccessorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true }, // Đổi từ Number thành String
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  });
  

const OrderConfirmationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [itemSchema],
    Accessory: [AccessorySchema],
    placer: {
        name: { type: String, default: '' }, 
        phone: { type: String, default: '' },
    },
    receiver: {
        similarToAbove: { type: Boolean, default: false },
        name: { type: String, default: '' },
        phone: { type: String, default: '' },
    },
    address: {
        district: { type: String, default: '' },
        ward: { type: String, default: '' },
        details: { type: String, default: '' },
    },
    bill: {
        tickBill: { type: Boolean, default: false },
    },
    time: {
        day: { type: String, default: '' },
        time: { type: String, default: '' },
    },
    totalAmount: { 
        type: Number, 
        required: true,
        default: 0, 
    },
    status: { type: String, default: 'available' },
});
OrderConfirmationSchema.pre('save', function (next) {
    // Tính tổng tiền của các item trong đơn hàng
    const itemsTotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Tính tổng tiền của các phụ kiện
    const accessoriesTotal = this.Accessory.reduce((sum, accessory) => sum + accessory.price * accessory.quantity, 0);
  
    // Cập nhật tổng số tiền đơn hàng
    this.totalAmount = itemsTotal + accessoriesTotal
  
    next();
  });
  


const OrderConfirmation = model('OrderConfirmation', OrderConfirmationSchema);

export default OrderConfirmation;
