import express from 'express';
import { createLogEntryWithFiles } from './log.entry.file.controller.js';
import LogEntryController from './log.entry.controller.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Ruta para crear log entry sin archivos (si existe)
router.post('/', LogEntryController.create);

// Nueva ruta para crear log entry con archivos y multer
router.post(
  '/with-files',
  upload.array('files'),       // <---- aquí multer procesa los archivos y el body
  createLogEntryWithFiles 
);

// Resto de rutas
router.get('/', LogEntryController.getAll);
router.get('/:id', LogEntryController.getById);
router.patch('/:id', LogEntryController.update);
router.delete('/:id', LogEntryController.softDelete);

// Extras
router.get('/student/:id_student', LogEntryController.getByStudent);
router.get('/module/:id_module', LogEntryController.getByModule);

export default router;

