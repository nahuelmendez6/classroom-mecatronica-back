import express from 'express';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';

import OrganizationAddressController from './organization.address.controller.js';

const router = express.Router();

// Middleware to verify token and check role
router.use(verifyToken, checkRole(['administrador']));

router.post('/', OrganizationAddressController.create);
router.get('/', OrganizationAddressController.getAll);
router.get('/:id', OrganizationAddressController.getByOrganizationId);
router.patch('/:id', OrganizationAddressController.update);
router.delete('/:id', OrganizationAddressController.delete);

export default router;
