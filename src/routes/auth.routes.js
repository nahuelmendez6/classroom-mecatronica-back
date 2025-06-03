import { Router } from 'express';
import { body } from 'express-validator';
import AuthController from '../controllers/auth.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';

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
router.post('/close-all-sessions', verifyToken, AuthController.closeAllSessions);
router.post('/admin/close-sessions-by-email', verifyToken, AuthController.closeAllSessionsByEmail);


router.get('/test', verifyToken, checkRole(['administrador']), (req, res) => {
    res.json({
      success: true,
      message: 'Autenticación y rol verificados correctamente',
      user: req.user
    });
  });

export default router; 