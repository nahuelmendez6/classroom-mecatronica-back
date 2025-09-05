import express from 'express';
import StudentAgreementController from './student.agreement.controller.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Crear con archivo
router.post('/', upload.single('file'), StudentAgreementController.create);

// Obtener todos
router.get('/', StudentAgreementController.findAll);

// Obtener por ID
router.get('/:id', StudentAgreementController.findById);

// Actualizar con archivo
router.put('/:id', upload.single('file'), StudentAgreementController.update);

// Eliminar
router.delete('/:id', StudentAgreementController.delete);

export default router;
