import express from 'express';
import { body } from 'express-validator';
import StudentController from '../controllers/student.controller.js';

const router = express.Router();

const validateStudent = [
    body('id_user').isInt().withMessage('id_user must be an integer'),
    body('name').notEmpty().withMessage('Name is required'),
    body('lastname').notEmpty().withMessage('Lastname is required'),
    body('dni').notEmpty().withMessage('DNI is required'),
    body('phone_number').notEmpty().withMessage('Phone number is required'),
    body('id_course').isInt().withMessage('id_course must be an integer')
];

// Crear estudiante
router.post('/', validateStudent, StudentController.create);

// Eliminar (soft-delete) estudiante
router.delete('/:id', StudentController.delete);

// Restaurar estudiante eliminado
router.post('/:id/restore', StudentController.restore);

// Obtener todos los estudiantes activos
router.get('/', StudentController.getAll);

// Obtener un estudiante por ID
router.get('/:id', StudentController.getById);

export default router;
