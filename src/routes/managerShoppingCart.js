import { Router } from 'express';
const router = Router();
import * as  shoppingCartController from '../controllers/shoppingCart.js';

router.get('/cart', shoppingCartController.getAllCartItems);
// router.post('/cart', shoppingCartController.addToCart);
// router.put('/cart/:id', shoppingCartController.updateCart);
// router.delete('/cart/:id', shoppingCartController.deleteFromCart);

export default router;