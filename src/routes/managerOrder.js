import { Router } from 'express';
const router = Router();
import * as orderConfirmationController from '../controllers/orderConfirmation.js';


router.get('/orders', orderConfirmationController.getAllOrders);
router.get('/orders/:id',orderConfirmationController.getOrderById)
router.get('/orders/:id/invoice', orderConfirmationController.printInvoice);
// router.put('/orders/:id', orderConfirmationController.updateOrder);
// router.delete('/orders/:id', orderConfirmationController.deleteOrder);

export default router;
