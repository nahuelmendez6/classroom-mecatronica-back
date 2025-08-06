import express from 'express';
import LogEntryController from './log.entry.controller.js';
import { createLogEntryWithFiles, getFilesByLogEntry } from
      './log.entry.file.controller.js';
import { upload } from '../middleware/upload.js';
 
const router = express.Router();
 
 // CRUD
router.post('/', upload.array('files'),
      createLogEntryWithFiles);
router.get('/', LogEntryController.getAll);
router.get('/:id', LogEntryController.getById);
router.patch('/:id', LogEntryController.update);
router.delete('/:id', LogEntryController.softDelete);

// Extras
router.get('/student/:id_student', LogEntryController.
getByStudent);
router.get('/module/:id_module', LogEntryController.
getByModule);
router.get('/:id/files', getFilesByLogEntry);
 
export default router;
