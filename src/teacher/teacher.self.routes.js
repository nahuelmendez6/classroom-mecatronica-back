import express from 'express';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
import TeacherSelfController from '../teacher/teacher.self.controller.js';

const router = express.Router();

router.use(verifyToken, checkRole(['profesor']));

router.get('/courses', TeacherSelfController.getTeacherCourses);
router.get('/groups', TeacherSelfController.getTeacherGroups);
router.get('/modules', TeacherSelfController.getTeacherModules);

export default router;
