import { Schema as _Schema, model, mongoose } from 'mongoose';
const Schema = _Schema;

const InvoiceSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Liên kết đến người dùng
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Tham chiếu đến sản phẩm
                required: true,
            },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            totalPrice: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true }, // Tổng số tiền
    placer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
    },
    receiver: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
    },
    address: {
        district: { type: String, required: true },
        ward: { type: String, required: true },
        details: { type: String, required: true },
    },
    billInfo: {
        tickBill: { type: Boolean, required: true },
    },
    deliveryTime: {
        day: { type: String, required: true },
        time: { type: String, required: true },
    },
    createdAt: { type: Date, default: Date.now },
});

const Invoice = model('Invoice', InvoiceSchema);

export default Invoice;
