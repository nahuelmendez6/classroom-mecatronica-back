import express from 'express';
import practiceAssignmentController from './practice.assingment.controller.js';

const router = express.Router();

router.get('/', practiceAssignmentController.getAll);
router.get('/:id', practiceAssignmentController.getById);
router.get('/by-group/:id_group', practiceAssignmentController.getByGroup);
router.post('/', practiceAssignmentController.create);
router.patch('/:id', practiceAssignmentController.update);
router.delete('/:id', practiceAssignmentController.remove);

export default router;
