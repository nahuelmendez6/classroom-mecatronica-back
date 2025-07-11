import { Router } from 'express';
import TaskTypeController from '../controllers/task.type.controller.js';


const router = Router();


router.get('/', TaskTypeController.getAllTaskTypes);

export default router;