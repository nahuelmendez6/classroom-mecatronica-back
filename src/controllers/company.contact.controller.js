import CompanyContactService from '../services/company.contact.service.js';
import { sendSuccess, sendError, sendValidationError } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/errorHandler.js';
import { validationResult } from 'express-validator';

export const createCompanyContactWithUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendValidationError(res, errors.array());
    }
    const newContact = await CompanyContactService.createCompanyContactWithUser(req.body);
    sendSuccess(res, 201, 'Contacto de empresa y usuario creados exitosamente', newContact);
});