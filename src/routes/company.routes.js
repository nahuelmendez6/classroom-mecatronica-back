import express from 'express';
import {
    createCompany,
    getCompanies
} from '../controllers/company.controller.js';

const router = express.Router();


// Obtener todas las empresas
router.get('/',getCompanies);

// Crear nueva empresa
router.post('/new', createCompany);

export default router;
