import { Router } from 'express';
import {
  getAllSubModules,
  getSubModuleById,
  createSubModule,
  updateSubModule,
  deleteSubModule
} from '../controllers/subModuleController.js';

const router = Router();

router.get('/', getAllSubModules);
router.get('/:id', getSubModuleById);
router.post('/', createSubModule);
router.put('/:id', updateSubModule);
router.delete('/:id', deleteSubModule);

export default router;
