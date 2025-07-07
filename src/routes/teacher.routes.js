import express from 'express';
import TeacherController from '../controllers/teacher.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { teacherValidation, userValidation } from '../utils/validation.js';

const router = express.Router();


// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/teachers - Obtener todos los cursos
router.get('/',
    TeacherController.getAll);

// POST /api/teachers - Crear un nuevo profesor
router.post('/', [
    teacherValidation.name,
    teacherValidation.lastname,
    teacherValidation.phone_number,
    teacherValidation.observations
], TeacherController.create);

// POST /api/teachers/full - Crear un nuevo profesor con usuario
router.post('/full', [
    teacherValidation.name,
    teacherValidation.lastname,
    teacherValidation.phone_number,
    teacherValidation.observations,
    userValidation.email,
    userValidation.password,
    userValidation.dni
], TeacherController.createWithUser);

// DELETE /api/teachers/soft-delete/:id - Realizar un borrado lógico de un profesor
router.patch('/soft-delete/:id', 
    TeacherController.softDelete);

// PATCH /api/teachers/:id - Actualizar parcialmente un profesor
router.patch('/:id', 
    TeacherController.update);

export default router; 