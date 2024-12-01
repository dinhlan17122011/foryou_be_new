import validateOrder from '../middlewares/validateOrder.js';
import checkShoppingCart from '../middlewares/checkShoppingCart.js';

describe('Middleware Tests', () => {
    test('validateOrder should return 400 if data is missing', () => {
        const req = { body: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        validateOrder(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Thiếu userId' });
    });

    test('validateOrder should call next if data is valid', () => {
        const req = {
            body: {
                userId: '123',
                placer: { name: 'John', phone: '123456789' },
                address: { district: 'A', ward: 'B', details: 'C' },
                time: { day: 'Monday', time: '10 AM' },
            },
        };
        const res = {};
        const next = jest.fn();

        validateOrder(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test('checkShoppingCart should return 404 if cart is empty', async () => {
        const req = { body: { userId: '123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        // Mock ShoppingCart model
        const ShoppingCart = {
            findOne: jest.fn().mockResolvedValue(null),
        };
        await checkShoppingCart(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Giỏ hàng trống' });
    });
});
