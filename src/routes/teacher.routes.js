import express from 'express';
import TeacherController from '../controllers/teacher.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
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

// GET /api/teacher/courses - Obtener cursos asignados al profesor autenticado
router.get('/courses', verifyToken, checkRole(['profesor']), TeacherController.getTeacherCourses);

// GET /api/teacher/groups - Obtener grupos de los cursos asignados al profesor autenticado
router.get('/groups', verifyToken, checkRole(['profesor']), TeacherController.getTeacherGroups);

// GET /api/teacher/modules - Obtener módulos de los cursos asignados al profesor autenticado
router.get('/modules',  (req, res, next) => {
  console.log("🔥 /modules llamada");
  next();
},
    verifyToken, checkRole(['profesor']), TeacherController.getTeacherModules);

export default router; 