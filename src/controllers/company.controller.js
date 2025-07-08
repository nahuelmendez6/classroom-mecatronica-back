import { validationResult } from 'express-validator';
import CompanyService from '../services/company.service.js';
import { sendSuccess, sendError, sendValidationError } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/errorHandler.js';

export const createCompany = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error("Validation errors:", errors.array());
        return sendValidationError(res, errors.array());
    }

    const newCompany = await CompanyService.createCompany(req.body);
    sendSuccess(res, 201, 'Empresa creada exitosamente', newCompany);
});

export const getCompanies = asyncHandler(async (req, res) => {
    const companies = await CompanyService.getAllCompanies();
    sendSuccess(res, 200, 'Empresas obtenidas correctamente', companies);
});

export const getCompanyById = asyncHandler(async (req, res) => {
    const company = await CompanyService.getCompanyById(req.params.id);
    sendSuccess(res, 200, 'Empresa obtenida correctamente', company);
});

export const updateCompany = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error("Validation errors:", errors.array()); // Log validation errors
        return sendValidationError(res, errors.array());
    }

    const updatedCompany = await CompanyService.updateCompany(req.params.id, req.body);
    sendSuccess(res, 200, 'Empresa actualizada exitosamente', updatedCompany);
});

export const softDeleteCompany = asyncHandler(async (req, res) => {
    await CompanyService.softDeleteCompany(req.params.id);
    sendSuccess(res, 200, 'Empresa eliminada exitosamente');
});
