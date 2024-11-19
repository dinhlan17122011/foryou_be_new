import express from 'express';
const app = express()
const port = 3000
import bodyParser from 'body-parser';
import connectDB from './config/connectDB.js'
import managerCakeRoutes from './routes/managerCakeRoutes.js'
import managerOrderRoutes from './routes/managerOrder.js'
import managerAccessoryRoutes from './routes/managerAccessoryRoutes.js'
import shoppingCartRouter from './routes/shoppingCartRouter.js'
import homePage from './routes/homePage.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Lấy tên thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/cake', managerCakeRoutes);
app.use('/shoping',shoppingCartRouter)
app.use('order', managerOrderRoutes);
app.use('/accessories', managerAccessoryRoutes);
app.use('/',homePage)
connectDB()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})