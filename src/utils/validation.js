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

export const courseValidation = {
    course: body('course')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre del curso debe tener entre 2 y 100 caracteres'),

    start_date: body('start_date')
        .isISO8601().withMessage('La fecha de inicio debe ser una fecha válida'),

    end_date: body('end_date')
        .isISO8601().withMessage('La fecha de fin debe ser una fecha válida'),

    status: body('status')
        .isIn(['Activo', 'Inactivo', 'Completado']).withMessage('El estado del curso no es válido'),

    description: body('description')
        .optional()
        .isString().withMessage('La descripción debe ser un texto')
};

export const moduleValidation = {
    name: body('name')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre del módulo debe tener entre 2 y 100 caracteres'),

    description: body('description')
        .optional()
        .isString().withMessage('La descripción debe ser un texto'),

    duration: body('duration')
        .isInt({ min: 1 }).withMessage('La duración debe ser un número entero positivo'),

    icon_url: body('icon_url')
        .optional()
        .isURL().withMessage('La URL del ícono no es válida'),

    id_course: body('id_course')
        .isInt({ min: 1 }).withMessage('El ID del curso debe ser un número entero positivo')
};