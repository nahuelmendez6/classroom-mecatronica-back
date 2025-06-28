/**
 * Authentication Routes
 * Handles user login, logout, and session management
 */

import { Router } from 'express';
import { body } from 'express-validator';
import AuthController from '../controllers/auth.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * Validation middleware for login
 */
const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .notEmpty()
        .withMessage('Password is required')
];

/**
 * Validation middleware for admin operations
 */
const adminEmailValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
];

// Public routes (no authentication required)
router.post('/login', loginValidation, AuthController.login);

// Protected routes (authentication required)
router.post('/logout', verifyToken, AuthController.logout);
router.get('/sessions', verifyToken, AuthController.getActiveSessions);
router.post('/close-all-sessions', verifyToken, AuthController.closeAllSessions);

// Admin-only routes
router.post(
    '/admin/close-sessions-by-email', 
    verifyToken, 
    checkRole(['administrador']),
    adminEmailValidation,
    AuthController.closeAllSessionsByEmail
);

// Test route for authentication verification
router.get(
    '/test', 
    verifyToken, 
    checkRole(['administrador']), 
    (req, res) => {
        res.json({
            success: true,
            message: 'Authentication and role verification successful',
            user: {
                id: req.user.id_user,
                email: req.user.email,
                role: req.user.role
            }
        });
    }
);

export default router; 