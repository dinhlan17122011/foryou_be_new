import { Router } from 'express';
const router = Router();
// import { getAccessories, addAccessory, updateAccessory } from '../controllers/accessoryControllers.js';
import * as  accessoryController from '../controllers/accessoryControllers.js';

router.get('/', accessoryController.getAccessories);
router.get('/add', accessoryController.add)
router.post('/add', accessoryController.createAccessory);

router.post('/update/:id', accessoryController.updateAccessory);
router.get('/update/:id',accessoryController.update)

// Route xóa phụ kiện
router.post('/delete/:id', accessoryController.deleteAccessory);

export default router;
