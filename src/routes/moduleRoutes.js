import express from 'express';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
import ModuleController from '../controllers/moduleController.js';
import { body, param } from 'express-validator';

const router = express.Router();

// Validaciones
const moduleValidation = [
    body('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 3, max: 100 })
        .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
    body('descripcion')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede tener más de 500 caracteres'),
    body('duracion')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La duración debe ser un número entero positivo'),
    body('icono')
        .optional()
        .isURL()
        .withMessage('El icono debe ser una URL válida'),
    body('id_profesor')
        .optional()
        .isInt()
        .withMessage('El ID del profesor debe ser un número entero válido'),
    body('id_course')
        .optional()
        .isInt()
        .withMessage('El ID del curso debe ser un número entero válido')
];

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/modules - Listar módulos
router.get('/', ModuleController.getAll);

// POST /api/modules - Crear módulo
router.post('/',
    checkRole(['Administrador']),
    moduleValidation,
    ModuleController.create
);

// DELETE /api/modules/:id - Eliminar módulo
router.delete('/:id',
    checkRole(['Administrador']),
    param('id').isInt().withMessage('ID de módulo inválido'),
    ModuleController.delete
);

// GET /api/modules/stats - Obtener estadísticas
router.get('/stats',
    checkRole(['Administrador']),
    ModuleController.getStats
);

export default router; 