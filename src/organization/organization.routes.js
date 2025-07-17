import express from 'express';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';

import OrganizationController from '../organization/organization.controller.js';

const router = express.Router();

// Middleware to verify token and check role
router.use(verifyToken, checkRole(['administrador']));

router.post('/', OrganizationController.create);
router.get('/', OrganizationController.getAll);
router.get('/:id', OrganizationController.getById);
router.patch('/:id', OrganizationController.update);
router.delete('/:id', OrganizationController.delete);


export default router;
