import express from 'express';
import { 
  getAllCourses, 
  getCourseById, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  enrollStudent,
  getStudentsByCourse
} from '../controllers/course.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/courses - Obtener todos los cursos
router.get('/', getAllCourses);

// GET /api/courses/:id - Obtener un curso por ID
router.get('/:id', getCourseById);

// POST /api/courses - Crear un nuevo curso
router.post('/', createCourse);


// POST /api/courses - Asociar estudiante a curso
router.post("/enroll", enrollStudent);

// PUT /api/courses/:id - Actualizar un curso
router.put('/:id', updateCourse);

// DELETE /api/courses/:id - Eliminar un curso
router.delete('/:id', deleteCourse);

router.get('/:courseId/students', getStudentsByCourse);


export default router; 