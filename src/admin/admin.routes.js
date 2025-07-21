import express from 'express';
import AdminController from './admin.controller.js';
import { body } from 'express-validator';
import {asyncHandler} from '../utils/errorHandler.js';

const router = express.Router();

/**
 * Validaciones para createWithUser
 */
const createAdminValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  body('dni').notEmpty().withMessage('DNI requerido'),
  body('name').notEmpty().withMessage('Nombre requerido'),
  body('lastname').notEmpty().withMessage('Apellido requerido'),
  // podés agregar más validaciones si querés
];

/**
 * Rutas base: /api/admins
 */
router.get('/', AdminController.getAll);
router.get('/:id', AdminController.getById);
router.get('/user/:userId', AdminController.getByUserId);

router.post('/', AdminController.create);

// Ruta especial para crear admin con usuario
router.post(
  '/with-user',
  createAdminValidator,
  asyncHandler(AdminController.createWithUser)
);

router.patch('/:id', AdminController.update);
router.delete('/:id', AdminController.remove);
router.patch('/:id/restore', AdminController.restore);

export default router;
