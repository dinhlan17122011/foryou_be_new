import express from 'express'
const app = express()
const port = 3000

import cors from 'cors';
import bodyParser from 'body-parser';

import connectDB from './config/connectDB.js';

import userRoutes from './routes/userRoutes.js';
import cakeRoutes from './routes/cakeRoutes.js';
import accessoryRoutes from './routes/accessoryRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB()

app.use('/api/users', userRoutes);
app.use('/api/accessories', accessoryRoutes);
app.use('/cakes', cakeRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
