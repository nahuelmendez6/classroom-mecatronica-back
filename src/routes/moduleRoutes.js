import express from 'express';
import multer from 'multer';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
import ModuleController from '../controllers/moduleController.js';
import { moduleValidation } from '../utils/validation.js';
import { param } from 'express-validator';

const router = express.Router();

// Configuración de multer
const storage = multer.memoryStorage(); // o multer.diskStorage({...}) si vas a guardar archivo
const upload = multer({ storage });

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/modules
router.get('/', ModuleController.getAll);

// POST /api/modules
router.post('/',
    checkRole(['administrador']),
    upload.single('icon_file'), // 👈 necesario para que funcione con multipart/form-data
    [
        moduleValidation.name,
        moduleValidation.description,
        moduleValidation.duration,
        moduleValidation.icon_url,
        moduleValidation.id_course
    ],
    ModuleController.create
);

// DELETE /api/modules/:id
router.delete('/:id',
    checkRole(['administrador']),
    param('id').isInt().withMessage('ID de módulo inválido'),
    ModuleController.delete
);

router.post('/enroll',
    verifyToken,
    checkRole(['administrador']),
    ModuleController.enrollStudent
);

router.get('/stats',
    checkRole(['administrador']),
    ModuleController.getStats
);

export default router;
