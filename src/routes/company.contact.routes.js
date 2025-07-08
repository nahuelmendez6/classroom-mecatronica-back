import express from 'express';
import { createCompanyContactWithUser } from '../controllers/company.contact.controller.js';
import { userValidation } from '../utils/validation.js';

const router = express.Router();

router.post('/new-with-user', [
    userValidation.email,
    userValidation.password,
    userValidation.firstName,
    userValidation.lastName,
    userValidation.dni,
    userValidation.phone,
], createCompanyContactWithUser);

export default router;
