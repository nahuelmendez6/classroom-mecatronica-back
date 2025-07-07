import express from 'express';
import {
    createCompany,
    getCompanies,
    // createCompanyWithAddressAndContact
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

// Crear empresa con direccion y contacto
// router.post("/full", createCompanyWithAddressAndContact)

export default router;
