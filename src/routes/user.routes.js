import { Router } from 'express';
import { body, param } from 'express-validator';
import UserController from '../controllers/user.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';

const router = Router();

// Validaciones comunes
const emailValidation = body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail();

const passwordValidation = body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida');

const nameValidation = body(['name', 'lastname'])
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre y apellido deben tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre y apellido solo pueden contener letras y espacios');

const dniValidation = body('dni')
    .optional()
    .isLength({ min: 7, max: 20 })
    .withMessage('El DNI debe tener entre 7 y 20 caracteres')
    .matches(/^[0-9]+$/)
    .withMessage('El DNI solo puede contener números');

const phoneValidation = body('phone_number')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('El número de teléfono no es válido');

const roleValidation = body('id_role')
    .isInt()
    .withMessage('El ID del rol debe ser un número entero válido');

const moduleValidation = body('id_module')
    .optional()
    .isInt()
    .withMessage('El módulo debe ser un número entero válido');

// Rutas públicas
router.post('/search', 
    emailValidation,
    UserController.searchUser
);

// Rutas protegidas
router.use(verifyToken); // Todas las rutas siguientes requieren autenticación

// Rutas que requieren rol de administrador
router.post('/',
    [
        emailValidation,
        passwordValidation,
        nameValidation,
        dniValidation,
        phoneValidation,
        roleValidation,
        moduleValidation,
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        })
    ],
    checkRole(['administrador']),
    UserController.createUser
);

// Rutas para obtener roles y módulos
router.get('/roles',
    checkRole(['administrador']),
    UserController.getAllRoles
);

router.get('/modules',
    checkRole(['administrador']),
    UserController.getAllModules
);

router.get('/teachers',
    checkRole(['administrador']),
    UserController.getAllTeachers
)

// Ruta para obtener estadísticas de usuarios
router.get('/stats',
    checkRole(['administrador']),
    UserController.getUserStats
);

// Rutas que requieren rol de administrador o profesor
router.get('/',
    checkRole(['administrador', 'Profesor']),
    UserController.getAllUsers
);


router.get('/:id_user',
    param('id_user').isInt().withMessage('ID de usuario inválido'),
    checkRole(['administrador', 'Profesor']),
    UserController.getUserById
);

router.put('/:id_user',
    [
        param('id_user').isInt().withMessage('ID de usuario inválido'),
        emailValidation.optional(),
        passwordValidation.optional(),
        nameValidation.optional(),
        dniValidation.optional(),
        phoneValidation.optional(),
        roleValidation.optional(),
        moduleValidation.optional()
    ],
    checkRole(['administrador']),
    UserController.updateUser
);

router.delete('/:id_user',
    param('id_user').isInt().withMessage('ID de usuario inválido'),
    checkRole(['administrador']),
    UserController.deleteUser
);

export default router; 