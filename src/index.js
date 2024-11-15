import express from 'express';
const app = express()
const port = 3000
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bodyParser from 'body-parser';
import connectDB from './config/connectDB.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set('views', join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})