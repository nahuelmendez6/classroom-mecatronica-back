/**
 * Module Controller
 * Handles module management operations including CRUD operations and module-specific functionality
 */

import Module from '../models/module.model.js';
import { validationResult } from 'express-validator';
import ModuleTeacher from '../models/module.teacher.model.js';
import { asyncHandler } from '../utils/errorHandler.js';
import { sendSuccess, sendValidationError } from '../utils/responseHandler.js';
import { ValidationError, NotFoundError } from '../utils/errorHandler.js';

class ModuleController {
    /**
     * Get all modules with teachers and submodules
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getAll = asyncHandler(async (req, res) => {
        const modules = await Module.getAll();
        
        // Transform data to include teachers correctly in submodules and module
        const result = modules.map(module => {
            const teachers = module.moduleTeachers.map(mt => ({
                id_teacher: mt.teacher.id_teacher,
                name: mt.teacher.User.first_name + ' ' + mt.teacher.User.last_name,
            }));

            return {
                ...module.toJSON(),
                submodules: module.submodules.map(sub => ({
                    ...sub.toJSON(),
                    teacher: teachers[0] || null  // Assign first teacher to submodule
                })),
                teachers: teachers
            };
        });

        sendSuccess(res, 200, 'Modules retrieved successfully', result);
    });

    /**
     * Create a new module
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static create = asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }

        const moduleData = req.body;
        const result = await Module.create(moduleData);

        sendSuccess(res, 201, 'Module created successfully', result);
    });

    /**
     * Get module by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        
        const module = await Module.getById(id);
        if (!module) {
            throw new NotFoundError('Module');
        }

        sendSuccess(res, 200, 'Module retrieved successfully', module);
    });

    /**
     * Update a module
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static update = asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }

        const { id } = req.params;
        const updateData = req.body;

        const result = await Module.update(id, updateData);
        if (!result) {
            throw new NotFoundError('Module');
        }

        sendSuccess(res, 200, 'Module updated successfully', result);
    });

    /**
     * Delete a module
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static delete = asyncHandler(async (req, res) => {
        const { id } = req.params;
        
        const result = await Module.delete(id);
        if (!result) {
            throw new NotFoundError('Module');
        }

        sendSuccess(res, 200, 'Module deleted successfully');
    });

    /**
     * Get module statistics
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getStats = asyncHandler(async (req, res) => {
        const stats = await Module.getStats();
        sendSuccess(res, 200, 'Module statistics retrieved successfully', stats);
    });

    /**
     * Enroll a student in a module
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static enrollStudent = asyncHandler(async (req, res) => {
        const { moduleId, studentId } = req.body;

        if (!moduleId || !studentId) {
            throw new ValidationError('moduleId and studentId are required');
        }

        const result = await Module.enrollStudent(moduleId, studentId);
        sendSuccess(res, 200, 'Student enrolled in module successfully', result);
    });

    /**
     * Remove a student from a module
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static removeStudent = asyncHandler(async (req, res) => {
        const { moduleId, studentId } = req.body;

        if (!moduleId || !studentId) {
            throw new ValidationError('moduleId and studentId are required');
        }

        const result = await Module.removeStudent(moduleId, studentId);
        sendSuccess(res, 200, 'Student removed from module successfully', result);
    });

    /**
     * Assign a teacher to a module
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static assignTeacher = asyncHandler(async (req, res) => {
        const { moduleId, teacherId } = req.body;

        if (!moduleId || !teacherId) {
            throw new ValidationError('moduleId and teacherId are required');
        }

        const result = await ModuleTeacher.create({
            id_module: moduleId,
            id_teacher: teacherId
        });

        sendSuccess(res, 201, 'Teacher assigned to module successfully', result);
    });

    /**
     * Remove a teacher from a module
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static removeTeacher = asyncHandler(async (req, res) => {
        const { moduleId, teacherId } = req.body;

        if (!moduleId || !teacherId) {
            throw new ValidationError('moduleId and teacherId are required');
        }

        const result = await ModuleTeacher.destroy({
            where: {
                id_module: moduleId,
                id_teacher: teacherId
            }
        });

        if (!result) {
            throw new NotFoundError('Teacher assignment');
        }

        sendSuccess(res, 200, 'Teacher removed from module successfully');
    });

    /**
     * Get students enrolled in a module
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getEnrolledStudents = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const students = await Module.getEnrolledStudents(id, {
            page: parseInt(page),
            limit: parseInt(limit)
        });

        sendSuccess(res, 200, 'Enrolled students retrieved successfully', students);
    });

    /**
     * Get teachers assigned to a module
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getAssignedTeachers = asyncHandler(async (req, res) => {
        const { id } = req.params;

        const teachers = await Module.getAssignedTeachers(id);
        sendSuccess(res, 200, 'Assigned teachers retrieved successfully', teachers);
    });

    /**
     * Get modules by course
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getByCourse = asyncHandler(async (req, res) => {
        const { courseId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const modules = await Module.getByCourse(courseId, {
            page: parseInt(page),
            limit: parseInt(limit)
        });

        sendSuccess(res, 200, 'Course modules retrieved successfully', modules);
    });

    /**
     * Get modules with search and filters
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static search = asyncHandler(async (req, res) => {
        const { search = '', courseId, teacherId, page = 1, limit = 10 } = req.query;

        const modules = await Module.search({
            search,
            courseId,
            teacherId,
            page: parseInt(page),
            limit: parseInt(limit)
        });

        sendSuccess(res, 200, 'Modules search completed successfully', modules);
    });
}

export default ModuleController; 