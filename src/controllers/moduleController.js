import { validationResult } from 'express-validator';
import ModuleService from '../services/module.services.js';
import { sendSuccess, sendError, sendValidationError } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/errorHandler.js';

class ModuleController {
    static getAll = asyncHandler(async (req, res) => {
        const modules = await ModuleService.getAll();
        sendSuccess(res, 200, 'Módulos obtenidos correctamente', modules);
    });

    static create = asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }

        const result = await ModuleService.create(req.body);
        sendSuccess(res, 201, 'Módulo creado exitosamente', result);
    });

    static delete = asyncHandler(async (req, res) => {
        await ModuleService.delete(req.params.id);
        sendSuccess(res, 200, 'Módulo eliminado exitosamente');
    });

    static getStats = asyncHandler(async (req, res) => {
        const stats = await ModuleService.getStats();
        sendSuccess(res, 200, 'Estadísticas obtenidas correctamente', stats);
    });

    static enrollStudent = asyncHandler(async (req, res) => {
        const { moduleId, studentId } = req.body;
        const result = await ModuleService.enrollStudent(moduleId, studentId);
        sendSuccess(res, 200, 'Estudiante inscrito en el módulo correctamente', result);
    });
}

export default ModuleController; 