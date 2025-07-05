/**
 * Validation Utilities
 * Common validation rules and helpers for request validation
 */

import { body, param, query } from 'express-validator';

/**
 * Common validation rules for user-related endpoints
 */
export const userValidation = {
    email: body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    password: body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    firstName: body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('First name can only contain letters and spaces'),
    
    lastName: body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('Last name can only contain letters and spaces'),
    
    phone: body('phone')
        .optional()
        .trim()
        .matches(/^[\+]?[0-9\s\-\(\)]{10,15}$/)
        .withMessage('Please provide a valid phone number'),
    
    roleId: body('id_role')
        .isInt({ min: 1, max: 4 })
        .withMessage('Role ID must be between 1 and 4')
};