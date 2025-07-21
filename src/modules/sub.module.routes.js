import express from 'express';
import SubModuleController from './sub.module.controller.js';

const router = express.Router();

router.get('/', SubModuleController.getAll);
router.get('/:id', SubModuleController.getById);
router.get('/module/:moduleId', SubModuleController.getByModuleId);
router.post('/', SubModuleController.create);
router.patch('/:id', SubModuleController.update);
router.delete('/:id', SubModuleController.remove);

export default router;
