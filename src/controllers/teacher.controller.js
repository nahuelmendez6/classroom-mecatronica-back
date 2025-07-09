import { validationResult } from 'express-validator';
import TeacherService from '../services/teacher.service.js';
import { sendSuccess, sendError, sendValidationError } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/errorHandler.js';



class TeacherController {
    
    static createWithUser = asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }

        const teacher = await TeacherService.createTeacherWithUser(req.body);
        sendSuccess(res, 201, 'Teacher created successfully with user', teacher);
    });
    
    static create = asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }

        const teacher = await TeacherService.createTeacher(req.body);
        sendSuccess(res, 201, 'Teacher created successfully', teacher);
    });

    static getAll = asyncHandler(async (req, res) => {
        const teachers = await TeacherService.getAllTeachers();
        const teachersWithEmail = teachers.map(teacher => ({
            ...teacher.toJSON(),
            email: teacher.User ? teacher.User.email : null
        }));
        sendSuccess(res, 200, 'Teachers retrieved successfully', teachersWithEmail);
    });

    static getById = asyncHandler(async (req, res) => {
        const teacher = await TeacherService.getTeacherById(req.params.id);
        sendSuccess(res, 200, 'Teacher retrieved successfully', teacher);
    });

    static restore = asyncHandler(async (req, res) => {
        await TeacherService.restoreTeacher(req.params.id);
        sendSuccess(res, 200, 'Teacher restored successfully');
    });

    static softDelete = asyncHandler(async (req, res) => {
        const { id } = req.params;
        await TeacherService.softDeleteTeacher(id);
        sendSuccess(res, 200, 'Teacher soft deleted successfully');
    });

    static update = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const teacherData = req.body;

        const updatedTeacher = await TeacherService.updateTeacher(id, teacherData);

        sendSuccess(res, 200, 'Teacher updated successfully', updatedTeacher);
    });

    static async getTeacherCourses(req, res) {
        try {
            const userId = req.user.id_user; // Assuming req.user is populated by auth middleware
            const courses = await TeacherService.getTeacherCourses(userId);
            sendSuccess(res, 200, 'Cursos del profesor obtenidos correctamente', courses);
        } catch (error) {
            sendError(res, error.statusCode || 500, error.message);
        }
    }

    static async getTeacherGroups(req, res) {
        try {
            const userId = req.user.id_user;
            const groups = await TeacherService.getTeacherGroups(userId);
            sendSuccess(res, 200, 'Grupos del profesor obtenidos correctamente', groups);
        } catch (error) {
            sendError(res, error.statusCode || 500, error.message);
        }
    }
}

export default TeacherController; 