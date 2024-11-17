import { Router } from 'express';
const router = Router();
// import { getAccessories, addAccessory, updateAccessory } from '../controllers/accessoryControllers.js';
import * as  accessoryController from '../controllers/accessoryControllers.js';

router.get('/accessories', accessoryController.getAllAccessories);
router.post('/accessories', accessoryController.createAccessory);
// router.put('/accessories/:id', accessoryController.updateAccessory);
// router.delete('/accessories/:id', accessoryController.deleteAccessory);

export default router;
