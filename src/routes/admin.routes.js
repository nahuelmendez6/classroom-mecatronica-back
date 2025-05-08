import express from 'express';
import { body } from 'express-validator';
import AdminController from '../controllers/admin.controller.js';

const router = express.Router();

// Validation middleware
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

// Routes
router.post('/', validateAdmin, AdminController.create);
router.delete('/:id', AdminController.delete);
router.get('/', AdminController.getAll);
router.get('/:id', AdminController.getById);

export default router; 