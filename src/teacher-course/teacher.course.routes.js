import express from 'express';
import TeacherCourseController from './teacher.course.controller.js';


const router = express.Router();

router.get('/', TeacherCourseController.getAll);
router.get('/teacher/:id_teacher', TeacherCourseController.getCoursesByTeacher);
router.get('/course/:id_course', TeacherCourseController.getTeachersByCourse);
router.post('/', TeacherCourseController.assignTeacherToCourse);
router.delete('/', TeacherCourseController.unassignTeacherFromCourse);

export default router;
