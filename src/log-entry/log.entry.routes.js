import express from 'express';
import LogEntryController from './log.entry.controller.js';

const router = express.Router();

// CRUD
router.post('/', LogEntryController.create);
router.get('/', LogEntryController.getAll);
router.get('/:id', LogEntryController.getById);
router.patch('/:id', LogEntryController.update);
router.delete('/:id', LogEntryController.softDelete);

// Extras
router.get('/student/:id_student', LogEntryController.getByStudent);
router.get('/module/:id_module', LogEntryController.getByModule);

export default router;
