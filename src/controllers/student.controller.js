import { validationResult } from 'express-validator';
import StudentService from '../services/student.service.js';
import { sendSuccess, sendError, sendValidationError } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/errorHandler.js';

export const createStudentWithUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendValidationError(res, errors.array());
    }

    const newStudent = await StudentService.createStudentWithUser(req.body);
    sendSuccess(res, 201, 'Estudiante creado y asignado al curso exitosamente.', newStudent);
});

export const createStudentUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendValidationError(res, errors.array());
    }

    const studentData = await StudentService.createStudentUser(req.body);
    sendSuccess(res, 201, 'Estudiante creado y asignado correctamente', studentData);
});

export const getAllStudents = asyncHandler(async (req, res) => {
    const students = await StudentService.getAllStudents();
    sendSuccess(res, 200, 'Estudiantes obtenidos correctamente', students);
});
