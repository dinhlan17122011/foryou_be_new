import express from 'express'
const app = express()
const port = 3000

import bodyParser from 'body-parser';

import connectDB from './config/connectDB.js';
import path from 'path';
import userRoutes from './routes/userRoutes.js';
import cakeRoutes from './routes/cakeRoutes.js';
import accessoryRoutes from './routes/accessoryRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/OrderConfirmation.js';
// const cors = require("cors");
import cors from 'cors';
import { fileURLToPath } from 'url';

import session from 'express-session';
import cookieParser from 'cookie-parser';

app.use(cookieParser(process.env.COOKIE_SECRET || 'defaultsecret'));

// Cấu hình express-session
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000, // 1 giờ
  },
}));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Thêm vào trong file server.js (hoặc file tương tự)
app.use(cors({
  origin: 'http://localhost:5000', // URL frontend
  credentials: true,              // Cho phép cookie được gửi
}));

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
