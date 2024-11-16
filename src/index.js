import express from 'express';
const app = express()
const port = 3000
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bodyParser from 'body-parser';
import connectDB from './config/connectDB.js'
// const managerCakeRoutes = require('./routes/managerCakeRoutes.js')

import managerCakeRoutes from './routes/managerCakeRoutes.js'
import managerOrderRoutes from './routes/managerOrder.js'
import managerAccessoryRoutes from './routes/managerAccessoryRoutes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set('views', join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/cake', managerCakeRoutes);
app.use('order', managerOrderRoutes);
app.use('/Accessor', managerAccessoryRoutes);

connectDB()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})