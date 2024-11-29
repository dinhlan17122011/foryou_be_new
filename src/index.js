import express from 'express';
const app = express()
const port = 3000
import bodyParser from 'body-parser';
import connectDB from './config/connectDB.js'
import managerCakeRoutes from './routes/managerCakeRoutes.js'
import managerOrderRoutes from './routes/singleAactionRouter.js'
import managerAccessoryRoutes from './routes/managerAccessoryRoutes.js'
import shoppingCartRouter from './routes/shoppingCartRouter.js'
import homePage from './routes/homePage.js';
import userRouter from './routes/userRouter.js';
import checkVar from './routes/checkVar.js'; // Import router đã tạo
import checkVarMiddlewares from './middlewares/checkVar.js'; // Import middleware
import cors from "cors";
app.use(cors());
import session from 'express-session';
import flash from 'connect-flash';

app.use(
  session({
    secret: 'your-secret-key', // Khóa bí mật (thay thế bằng giá trị an toàn hơn trong sản phẩm thực tế)
    resave: false,
    saveUninitialized: true,
  })
);

import Tong from './routes/Tong.js'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Lấy tên thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());

// Middleware để lưu thông báo vào locals
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/cake', managerCakeRoutes);
app.use('/shoping',shoppingCartRouter)
app.use('/', managerOrderRoutes);
app.use('/accessories', managerAccessoryRoutes);
app.use('/',homePage)
app.use('/',userRouter)
app.use('/',Tong)
connectDB()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})