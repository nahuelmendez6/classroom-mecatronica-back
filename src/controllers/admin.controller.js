import { validationResult } from 'express-validator';
import AdminService from '../services/admin.service.js';
import { sendSuccess, sendError, sendValidationError } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/errorHandler.js';

class AdminController {
    static create = asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }

        const admin = await AdminService.createAdmin(req.body);
        sendSuccess(res, 201, 'Admin created successfully', admin);
    });

    static delete = asyncHandler(async (req, res) => {
        await AdminService.deleteAdmin(req.params.id);
        sendSuccess(res, 200, 'Admin deleted successfully');
    });

    static getAll = asyncHandler(async (req, res) => {
        const admins = await AdminService.getAllAdmins();
        sendSuccess(res, 200, 'Admins retrieved successfully', admins);
    });

    static getById = asyncHandler(async (req, res) => {
        const admin = await AdminService.getAdminById(req.params.id);
        sendSuccess(res, 200, 'Admin retrieved successfully', admin);
    });

    static restore = asyncHandler(async (req, res) => {
        await AdminService.restoreAdmin(req.params.id);
        sendSuccess(res, 200, 'Admin restored successfully');
    });
}

export default AdminController; 