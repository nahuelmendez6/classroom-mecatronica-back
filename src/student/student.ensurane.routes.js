import express from 'express';
import StudentEnsuranceController from './student.ensurance.controller.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Crear un seguro de estudiante con archivo
router.post('/', upload.single('file'), StudentEnsuranceController.create);

// Obtener todos los seguros
router.get('/', StudentEnsuranceController.getAll);

// Obtener un seguro por ID
router.get('/:id', StudentEnsuranceController.getById);

// Actualizar un seguro con archivo
router.put('/:id', upload.single('file'), StudentEnsuranceController.update);

// Eliminar un seguro
router.delete('/:id', StudentEnsuranceController.remove);

export default router;
