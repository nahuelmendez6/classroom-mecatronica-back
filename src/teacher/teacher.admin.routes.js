// routes

import { Router } from 'express';
import TeacherAdminController from './teacher.admin.controller.js';

import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
import { teacherValidation, userValidation } from '../utils/validation.js ';
import { check } from 'express-validator';

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken, checkRole(['administrador', 'profesor']));

// router.get('/', TeacherAdminController.getAll);
// router.get('/:id', TeacherAdminController.getById);



// router.post('/', [
//     teacherValidation.name,
//     teacherValidation.lastname,
//     teacherValidation.phone_number,
//     teacherValidation.observations
// ], teacherAdminController.create);
router.get('/', TeacherAdminController.getAll);

router.post('/full', [
    teacherValidation.name,
    teacherValidation.lastname,
    teacherValidation.phone_number,
    teacherValidation.observations,
    userValidation.email,
    userValidation.password,
    userValidation.dni
], TeacherAdminController.createWithUser);

router.patch('/:id', TeacherAdminController.update);
// router.patch('/soft-delete/:id', teacherAdminController.softDelete);
// router.patch('/restore/:id', teacherAdminController.restore);

export default router;