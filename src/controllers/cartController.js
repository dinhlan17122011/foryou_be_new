import ShoppingCart from '../models/shoppingCartModels.js';
import Invoice from '../models/InvoiceModels.js';
import OrderConfirmation from '../models/orderConfirmationModels.js';

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity, price } = req.body;

        if (!userId || !productId || !quantity || !price) {
            return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
        }

        // Kiểm tra xem giỏ hàng đã tồn tại hay chưa
        let cart = await ShoppingCart.findOne({ userId });

        if (!cart) {
            // Tạo giỏ hàng mới nếu chưa tồn tại
            cart = new ShoppingCart({
                userId,
                products: [{ productId, quantity, price }],
                totalPrice: quantity * price,
            });
        } else {
            // Cập nhật giỏ hàng nếu đã tồn tại
            const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);

            if (productIndex > -1) {
                // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
                cart.products[productIndex].quantity += quantity;
                cart.products[productIndex].price = price;
            } else {
                // Nếu sản phẩm chưa có, thêm sản phẩm mới
                cart.products.push({ productId, quantity, price });
            }

            // Cập nhật tổng giá trị giỏ hàng
            cart.totalPrice = cart.products.reduce((total, item) => total + item.quantity * item.price, 0);
        }

        const savedCart = await cart.save();
        res.status(200).json({ message: "Thêm vào giỏ hàng thành công", cart: savedCart });
    } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Đặt hàng và gộp dữ liệu
export const placeOrder = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }

        // Lấy thông tin từ `OrderConfirmation` và `ShoppingCart`
        const orderConfirmation = await OrderConfirmation.findOne({ userId });
        const shoppingCart = await ShoppingCart.findOne({ userId });

        if (!orderConfirmation) {
            return res.status(404).json({ message: "Không tìm thấy thông tin đặt hàng" });
        }

        if (!shoppingCart || shoppingCart.products.length === 0) {
            return res.status(404).json({ message: "Giỏ hàng trống" });
        }

        // Tạo hóa đơn từ dữ liệu `OrderConfirmation` và `ShoppingCart`
        const invoice = new Invoice({
            userId,
            items: shoppingCart.products.map((product) => ({
                productId: product.productId,
                name: product.productId.name || "Tên sản phẩm", // Có thể lấy tên sản phẩm từ model thực tế
                price: product.price,
                quantity: product.quantity,
                totalPrice: product.price * product.quantity,
            })),
            totalAmount: shoppingCart.totalPrice,
            placer: orderConfirmation.placer,
            receiver: orderConfirmation.receiver.similarToAbove
                ? orderConfirmation.placer
                : orderConfirmation.receiver,
            address: orderConfirmation.address,
            billInfo: orderConfirmation.bill,
            deliveryTime: orderConfirmation.time,
        });

        // Lưu hóa đơn vào cơ sở dữ liệu
        const savedInvoice = await invoice.save();

        // Xóa giỏ hàng và thông tin đặt hàng sau khi đặt hàng thành công
        await ShoppingCart.findOneAndDelete({ userId });
        await OrderConfirmation.findOneAndDelete({ userId });

        res.status(201).json({ message: "Đặt hàng thành công", invoice: savedInvoice });
    } catch (error) {
        console.error("Lỗi khi đặt hàng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const getInvoices = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }

        const invoices = await Invoice.find({ userId });

        if (!invoices || invoices.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
        }

        res.status(200).json(invoices);
    } catch (error) {
        console.error("Lỗi khi lấy hóa đơn:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Xem giỏ hàng
export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }

        const cart = await ShoppingCart.findOne({ userId }).populate('products.productId', 'name price');

        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
