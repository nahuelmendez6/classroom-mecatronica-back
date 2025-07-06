import { Router } from 'express';
import { createStudentUser, getAllStudents } from '../controllers/student.controller.js';
import { studentValidation } from '../utils/validation.js';

const router = Router()

/**
 * Ruta: POST /api/students
 * Crea un nuevo usuario estudiante y lo asigna a un curso
 */
router.post(
    '/',
    [
        studentValidation.name,
        studentValidation.lastname,
        studentValidation.dni,
        studentValidation.phone_number,
        studentValidation.observations
    ],
    createStudentUser
  );

router.get('/students', getAllStudents);

export default router;
