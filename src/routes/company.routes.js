import express from 'express';
import {
    createCompany,
    getCompanies,
    createCompanyWithAddressAndContact
} from '../controllers/company.controller.js';

const router = express.Router();


// Obtener todas las empresas
router.get('/',getCompanies);

// Crear nueva empresa
router.post('/new', createCompany);

// Crear empresa con direccion y contacto
router.post("/full", createCompanyWithAddressAndContact)

export default router;
