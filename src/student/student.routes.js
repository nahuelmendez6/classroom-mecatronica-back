import express from 'express';
import StudentController from './student.controller.js';

const router = express.Router();

// Crear estudiante con usuario
router.post('/', StudentController.create);

// Obtener todos los estudiantes
router.get('/', StudentController.findAll);

// Obtener un estudiante por ID
router.get('/:id', StudentController.findById);

// Actualizar estudiante
router.patch('/:id', StudentController.update);

// Eliminar estudiante
router.delete('/:id', StudentController.delete);

export default router;
