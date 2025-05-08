// Importación de dependencias
const express = require('express');
const { body } = require('express-validator');
const AdminController = require('../controllers/admin.controller');

// Creación del router de Express
const router = express.Router();

/**
 * Middleware de validación para los datos del administrador
 * Valida:
 * - Email: debe ser un email válido
 * - Password: mínimo 6 caracteres
 * - Name: no puede estar vacío
 * - Lastname: no puede estar vacío
 */
const validateAdmin = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .trim(),
    body('lastname')
        .notEmpty()
        .withMessage('Lastname is required')
        .trim()
];

// Definición de rutas
// POST /api/admins - Crear un nuevo administrador
router.post('/', validateAdmin, AdminController.create);

// DELETE /api/admins/:id - Eliminar un administrador
router.delete('/:id', AdminController.delete);

// GET /api/admins - Obtener todos los administradores
router.get('/', AdminController.getAll);

// GET /api/admins/:id - Obtener un administrador específico
router.get('/:id', AdminController.getById);

module.exports = router; 