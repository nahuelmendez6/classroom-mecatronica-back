import express from 'express';
import {
    createCompanyAddress,
    getCompanyAddressesByCompanyId
} from '../controllers/company.address.controller.js';

const router = express.Router();


// buscar direccin con id_company
router.get('/company/:id_company/', getCompanyAddressesByCompanyId);


// crear nueva direccion
router.post('/new', createCompanyAddress);

export  default router;