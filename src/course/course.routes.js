import CourseController from './course.controller.js';
import express from 'express';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';


const router = express.Router();

// Middleware to verify token and check role
router.use(verifyToken, checkRole(['administrador']));

router.post('/', CourseController.create);
router.get('/', CourseController.findAll);
router.get('/active', CourseController.findActive);
router.get('/:id', CourseController.findById);
router.put('/:id', CourseController.update);
router.delete('/:id', CourseController.delete);

export default router;
