/**
 * Validation Utilities
 * Common validation rules and helpers for request validation
 */

import { body, param, query } from 'express-validator';

/**
 * Common validation rules for user data
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

/**
 * Common validation rules for pagination
 */
export const paginationValidation = {
    page: query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    limit: query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    search: query('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be between 1 and 100 characters')
};

/**
 * Common validation rules for IDs
 */
export const idValidation = {
    userId: param('id')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),
    
    moduleId: param('id')
        .isInt({ min: 1 })
        .withMessage('Module ID must be a positive integer'),
    
    courseId: param('id')
        .isInt({ min: 1 })
        .withMessage('Course ID must be a positive integer'),
    
    companyId: param('id')
        .isInt({ min: 1 })
        .withMessage('Company ID must be a positive integer')
};

/**
 * Validation rules for company data
 */
export const companyValidation = {
    name: body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Company name must be between 2 and 100 characters'),
    
    description: body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    
    website: body('website')
        .optional()
        .trim()
        .isURL()
        .withMessage('Please provide a valid website URL')
};

/**
 * Validation rules for module data
 */
export const moduleValidation = {
    name: body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Module name must be between 2 and 100 characters'),
    
    description: body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    
    courseId: body('id_course')
        .isInt({ min: 1 })
        .withMessage('Course ID must be a positive integer')
};

/**
 * Validation rules for course data
 */
export const courseValidation = {
    name: body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Course name must be between 2 and 100 characters'),
    
    description: body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters')
};

/**
 * Helper function to create validation chain for common operations
 */
export const createValidationChain = (validations) => {
    return validations.map(validation => validation);
};

/**
 * Helper function to validate optional fields
 */
export const optionalField = (validation) => {
    return validation.optional();
}; 