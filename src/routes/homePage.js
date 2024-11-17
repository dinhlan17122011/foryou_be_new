import { Router } from 'express';
const router = Router();

import homePage from '../controllers/homePage.js';

router.get('/',homePage.index)

export default router;