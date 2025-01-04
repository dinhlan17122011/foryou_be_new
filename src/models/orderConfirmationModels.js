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
    number: { type: Number, required: true },
    price: { type: Number, required: true }, // Đảm bảo có giá cho phụ kiện
    quantity: { type: Number, required: true }, // Đảm bảo có số lượng
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
    }
});

// Nếu `receiver.similarToAbove` là true, tự động sao chép thông tin từ `placer` sang `receiver`
OrderConfirmationSchema.pre('save', function (next) {
    if (this.receiver.similarToAbove) {
        this.receiver.name = this.placer.name;
        this.receiver.phone = this.placer.phone;
    }

    // Tính tổng số tiền đơn hàng (tính cả items và phụ kiện)
    this.totalAmount = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
                        this.Accessory.reduce((sum, accessory) => sum + accessory.price * accessory.quantity, 0);

    next();
});

const OrderConfirmation = model('OrderConfirmation', OrderConfirmationSchema);

export default OrderConfirmation;
