import supertest from 'supertest';
import app from '../index.js'; // Đảm bảo bạn có tệp app.js định nghĩa express

describe('Controller Tests', () => {
    test('POST /place-order should return 400 if data is missing', async () => {
        const response = await supertest(app).post('/place-order').send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Thiếu userId');
    });

    test('POST /place-order should process order if data is valid', async () => {
        const validOrder = {
            userId: '64bff76b1234567890abcdef',
            placer: { name: 'John Doe', phone: '123456789' },
            address: { district: 'A', ward: 'B', details: 'C' },
            time: { day: 'Monday', time: '10:00 AM' },
        };

        const response = await supertest(app).post('/place-order').send(validOrder);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Đặt hàng thành công');
    });
});
