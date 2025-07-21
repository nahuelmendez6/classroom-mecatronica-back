import express from 'express';
import StudentCourseController from './student.course.controller.js';

const router = express.Router();

// CRUD básico
router.get('/', StudentCourseController.getAll);
router.get('/:id', StudentCourseController.getById);
router.post('/', StudentCourseController.create);
router.patch('/:id', StudentCourseController.update);
router.delete('/:id', StudentCourseController.remove);

// Búsquedas específicas
router.get('/student/:id_student', StudentCourseController.getByStudentId);
router.get('/course/:id_course', StudentCourseController.getByCourseId);

export default router;
