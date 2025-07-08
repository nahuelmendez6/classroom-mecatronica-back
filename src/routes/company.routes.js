import express from 'express';
import {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    softDeleteCompany
} from '../controllers/company.controller.js';
import { companyValidation } from '../utils/validation.js';

const router = express.Router();


// Obtener todas las empresas
router.get('/',getCompanies);

// Crear nueva empresa
router.post('/new', [
    companyValidation.name,
    companyValidation.cuit,
    companyValidation.sector,
    companyValidation.description,
    companyValidation.size
], createCompany);

// Actualizar parcialmente una empresa
router.patch('/:id', [
    companyValidation.name.optional(),
    companyValidation.cuit.optional(),
    companyValidation.sector.optional(),
    companyValidation.description.optional(),
    companyValidation.size.optional()
], updateCompany);

// Eliminar una empresa
router.patch('/soft-delete/:id', softDeleteCompany);

export default router;
