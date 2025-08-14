import express from 'express';
import OrganizationAgreementController from './organization.agreement.controller.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('file'), OrganizationAgreementController.create);
router.get('/', OrganizationAgreementController.getAll);
router.get('/:id', OrganizationAgreementController.getById);
router.put('/:id', upload.single('file'), OrganizationAgreementController.update);
router.delete('/:id', OrganizationAgreementController.delete);

export default router;
