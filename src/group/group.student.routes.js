import express from 'express';
import groupStudentController from './group.student.controller.js';

const router = express.Router();

// Obtener todas las relaciones group-student
router.get('/', groupStudentController.getAll);



// Obtener todos los estudiantes de un grupo
router.get('/group/:id_group', groupStudentController.getByGroupId);

// Obtener todos los grupos de un estudiante
router.get('/student/:id_student', groupStudentController.getByStudentId);

// Crear una relación group-student
router.post('/', groupStudentController.create);

// Eliminar una relación group-student (clave compuesta en params)
router.delete('/:id_group/:id_student', groupStudentController.delete);

export default router;
