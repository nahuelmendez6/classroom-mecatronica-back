import { Router } from 'express';
import { body } from 'express-validator';
import AuthController from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

// Validaciones para el login
const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('El email debe ser válido')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
];

// Rutas públicas
router.post('/login', loginValidation, AuthController.login);

// Rutas protegidas
router.post('/logout', verifyToken, AuthController.logout);
router.get('/sessions', verifyToken, AuthController.getActiveSessions);

export default router; 