import { Router } from 'express';
const router = Router();
import * as orderConfirmationController from '../controllers/orderConfirmation.js';


router.get('/orders', orderConfirmationController.getAllOrders);
router.post('/orders', orderConfirmationController.createOrder);
// router.put('/orders/:id', orderConfirmationController.updateOrder);
// router.delete('/orders/:id', orderConfirmationController.deleteOrder);

export default router;
