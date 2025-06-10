import express from 'express';
import TeacherController from '../controllers/teacher.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();


// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/teachers - Obtener todos los cursos
router.get('/',
    TeacherController.getAll);


export default router; 