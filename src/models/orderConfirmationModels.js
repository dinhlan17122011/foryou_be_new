import { Schema as _Schema, model, mongoose } from 'mongoose';
const Schema = _Schema;

const OrderConfirmationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Liên kết đến người dùng
        required: true,
    },
    placer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
    },
    receiver: {
        similarToAbove: { type: Boolean, required: true },
        name: { type: String },
        phone: { type: String },
    },
    address: {
        district: { type: String, required: true },
        ward: { type: String, required: true },
        details: { type: String, required: true },
    },
    bill: {
        tickBill: { type: Boolean, required: true },
    },
    time: {
        day: { type: String, required: true },
        time: { type: String, required: true },
    },
});

// Nếu `receiver.similarToAbove` là true, tự động sao chép thông tin từ `placer` sang `receiver`
OrderConfirmationSchema.pre('save', function (next) {
    if (this.receiver.similarToAbove) {
        this.receiver.name = this.placer.name;
        this.receiver.phone = this.placer.phone;
    }
    next();
});

const OrderConfirmation = model('OrderConfirmation', OrderConfirmationSchema);

export default OrderConfirmation;
