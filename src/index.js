import express from 'express'
const app = express()
const port = 3000

import bodyParser from 'body-parser';

import connectDB from './config/connectDB.js';

import userRoutes from './routes/userRoutes.js';
import cakeRoutes from './routes/cakeRoutes.js';
import accessoryRoutes from './routes/accessoryRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/OrderConfirmation.js';
// const cors = require("cors");
import cors from 'cors';

import session from 'express-session';
import cookieParser from 'cookie-parser';

app.use(cookieParser());

// Cấu hình express-session
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',  // Secret để mã hóa session
    resave: false,  // Không lưu session nếu không có sự thay đổi
    saveUninitialized: false,  // Không lưu session khi chưa có gì thay đổi
    cookie: {
        httpOnly: true,  // Bảo vệ khỏi việc client có thể truy cập cookie thông qua JS
        secure: process.env.NODE_ENV === 'production',  // Sử dụng secure cookie khi ở môi trường production
        maxAge: 3600000, // Thời gian sống của session (1 giờ)
    },
}));

// Thêm vào trong file server.js (hoặc file tương tự)
app.use(cors());

console.log(cors);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB()

app.use('/api/users', userRoutes);
app.use('/api/accessories', accessoryRoutes);
app.use('/cakes', cakeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/order-confirmation', orderRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
