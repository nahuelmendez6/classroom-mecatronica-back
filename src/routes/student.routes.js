import { Router } from 'express';
import { body } from 'express-validator';
import { createStudentWithUser, getAllStudents, createStudentUser } from '../controllers/student.controller.js';


const router = Router()

// Validaciones para la creación del estudiante (reutilizando y adaptando las de user.routes.js)
const emailValidation = body('email')
    .isEmail().withMessage('El email debe ser válido')
    .normalizeEmail();

const passwordValidation = body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres');

const nameValidation = body(['name', 'lastname'])
    .isLength({ min: 2, max: 100 }).withMessage('El nombre y apellido deben tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre y apellido solo pueden contener letras y espacios');

const dniValidation = body('dni')
    .notEmpty().withMessage('El DNI es requerido')
    .isLength({ min: 7, max: 20 }).withMessage('El DNI debe tener entre 7 y 20 caracteres')
    .matches(/^[0-9]+$/).withMessage('El DNI solo puede contener números');

const phoneValidation = body('phone_number')
    .optional()
    .matches(/^[0-9+\-\s()]+$/).withMessage('El número de teléfono no es válido');

const courseValidation = body('id_course')
    .isInt({ gt: 0 }).withMessage('El ID del curso debe ser un número entero válido y positivo');

// router.post(
//     '/create-with-user',
//     [
//         emailValidation,
//         passwordValidation,
//         nameValidation,
//         dniValidation,
//         phoneValidation,
//         courseValidation,
//         body('confirmPassword').custom((value, { req }) => {
//             if (value !== req.body.password) {
//                 throw new Error('Las contraseñas no coinciden');
//             }
//             return true;
//         }),
//         body('observations').optional().isString()
//     ],
//     createStudentWithUser
// );


/**
 * Ruta: POST /api/students
 * Crea un nuevo usuario estudiante y lo asigna a un curso
 */
router.post(
    '/',
    [
      body('email').isEmail().withMessage('Email inválido'),
      body('dni').notEmpty().withMessage('DNI requerido'),
      body('name').notEmpty().withMessage('Nombre requerido'),
      body('lastname').notEmpty().withMessage('Apellido requerido'),
      body('id_course').isInt().withMessage('ID de curso inválido'),
      body('phone_number').optional().isString(),
      body('observations').optional().isString()
    ],
    createStudentUser
  );

router.get('/students', getAllStudents);

export default router;// En tu archivo principal como app.js o index.js
