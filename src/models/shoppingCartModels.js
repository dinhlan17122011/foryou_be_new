import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const shoppingCartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Liên kết với người dùng
    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Accessory', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    totalPrice: { type: Number, required: true }, // Tổng giá trị của giỏ hàng
}, { timestamps: true });

const ShoppingCart = model('ShoppingCart', shoppingCartSchema);

export default ShoppingCart;
