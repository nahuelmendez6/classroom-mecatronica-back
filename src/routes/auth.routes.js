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
        .notEmpty()
        .withMessage('La contraseña es requerida')
];

// Rutas públicas
router.post('/login', loginValidation, AuthController.login);

// Rutas protegidas
router.post('/logout', verifyToken, AuthController.logout);
router.get('/sessions', verifyToken, AuthController.getActiveSessions);

export default router; 