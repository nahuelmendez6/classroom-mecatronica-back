/**
 * User Routes
 * Handles all user-related API endpoints with proper validation and authorization
 */

import { Router } from 'express';
import { body, param } from 'express-validator';
import UserController from '../controllers/user.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
import { userValidation, idValidation, paginationValidation } from '../utils/validation.js';

const router = Router();

/**
 * Custom validation for password confirmation
 */
const confirmPasswordValidation = body('confirmPassword')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    });

/**
 * Validation for DNI
 */
const dniValidation = body('dni')
    .optional()
    .isLength({ min: 7, max: 20 })
    .withMessage('DNI must be between 7 and 20 characters')
    .matches(/^[0-9]+$/)
    .withMessage('DNI can only contain numbers');

/**
 * Validation for phone number
 */
const phoneValidation = body('phone_number')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Invalid phone number format');

/**
 * Validation for module ID
 */
const moduleValidation = body('id_module')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Module ID must be a valid positive integer');

/**
 * Validation for company ID
 */
const companyValidation = body('id_company')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Company ID must be a valid positive integer');

/**
 * Validation for position
 */
const positionValidation = body('position')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Position must not exceed 100 characters');

/**
 * Validation for observations
 */
const observationsValidation = body('observations')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Observations must not exceed 500 characters');

// Public routes (no authentication required)
router.post('/search', 
    userValidation.email,
    UserController.searchUser
);

// Protected routes (authentication required)
router.use(verifyToken);

// Admin-only routes
router.post('/',
    [
        userValidation.email,
        userValidation.password,
        userValidation.firstName,
        userValidation.lastName,
        dniValidation,
        phoneValidation,
        userValidation.roleId,
        moduleValidation,
        companyValidation,
        positionValidation,
        observationsValidation,
        confirmPasswordValidation
    ],
    checkRole(['administrador']),
    UserController.createUser
);

router.get('/roles',
    checkRole(['administrador']),
    UserController.getAllRoles
);

router.get('/modules',
    checkRole(['administrador']),
    UserController.getAllModules
);

router.get('/stats',
    checkRole(['administrador']),
    UserController.getUserStats
);

router.put('/:id',
    [
        idValidation.userId,
        userValidation.email.optional(),
        userValidation.password.optional(),
        userValidation.firstName.optional(),
        userValidation.lastName.optional(),
        dniValidation.optional(),
        phoneValidation.optional(),
        userValidation.roleId.optional(),
        moduleValidation.optional(),
        companyValidation.optional(),
        positionValidation.optional(),
        observationsValidation.optional()
    ],
    checkRole(['administrador']),
    UserController.updateUser
);

router.delete('/:id',
    idValidation.userId,
    checkRole(['administrador']),
    UserController.deleteUser
);

// Routes for administrators and teachers
router.get('/',
    [
        paginationValidation.page,
        paginationValidation.limit,
        paginationValidation.search
    ],
    checkRole(['administrador', 'profesor']),
    UserController.getAllUsers
);

router.get('/:id',
    idValidation.userId,
    checkRole(['administrador', 'profesor']),
    UserController.getUserById
);

router.get('/teachers',
    [
        paginationValidation.page,
        paginationValidation.limit,
        paginationValidation.search
    ],
    checkRole(['administrador']),
    UserController.getAllTeachers
);

export default router; 