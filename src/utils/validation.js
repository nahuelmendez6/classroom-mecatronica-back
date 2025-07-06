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
        .isEmail().withMessage('El email debe ser válido')
        .normalizeEmail(),

    password: body('password')
        .notEmpty().withMessage('La contraseña es requerida'),

    confirmPassword: body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        }),

    firstName: body('name')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),

    lastName: body('lastname')
        .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras y espacios'),

    dni: body('dni')
        .optional()
        .isLength({ min: 7, max: 20 }).withMessage('El DNI debe tener entre 7 y 20 caracteres')
        .matches(/^[0-9]+$/).withMessage('El DNI solo puede contener números'),

    phone: body('phone_number')
        .optional()
        .matches(/^[0-9+\-\s()]+$/).withMessage('El número de teléfono no es válido'),

    roleId: body('id_role')
        .isInt().withMessage('El ID del rol debe ser un número entero válido'),

    moduleId: body('id_module')
        .optional()
        .isInt().withMessage('El módulo debe ser un número entero válido'),
};

export const idValidation = {
    userId: param('id_user')
        .isInt({ min: 1 }).withMessage('ID de usuario inválido')
};

export const studentValidation = {
    name: body('name')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),

    lastname: body('lastname')
        .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras y espacios'),

    dni: body('dni')
        .isLength({ min: 7, max: 20 }).withMessage('El DNI debe tener entre 7 y 20 caracteres')
        .matches(/^[0-9]+$/).withMessage('El DNI solo puede contener números'),

    phone_number: body('phone_number')
        .optional()
        .matches(/^[0-9+\-\s()]+$/).withMessage('El número de teléfono no es válido'),

    observations: body('observations')
        .optional()
        .isString().withMessage('Las observaciones deben ser un texto')
};