import express from 'express';
import ModuleController from './module.controller.js';

const router = express.Router();

router.get('/', ModuleController.getAll); // ?details=true para incluir relaciones
router.get('/stats', ModuleController.getStats);
router.get('/:id', ModuleController.getById);
router.post('/', ModuleController.create);
router.put('/:id', ModuleController.update);
router.delete('/:id', ModuleController.remove);

export default router;
