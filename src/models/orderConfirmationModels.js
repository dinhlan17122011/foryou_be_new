import { Schema as _Schema, model, mongoose } from 'mongoose';
const Schema = _Schema;

const OrderConfirmationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    placer: {
        name: { type: String, default: '' }, // Thay required bằng default
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
