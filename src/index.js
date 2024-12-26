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
app.use('/api', orderRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
