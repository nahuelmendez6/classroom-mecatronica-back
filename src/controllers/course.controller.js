/**
 * Course Controller
 * Handles course management operations including CRUD operations and course-specific functionality
 */

import Course from '../models/Course.js';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../utils/errorHandler.js';
import { sendSuccess, sendValidationError } from '../utils/responseHandler.js';
import { ValidationError, NotFoundError } from '../utils/errorHandler.js';

class CourseController {
    /**
     * Get all courses
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getAll = asyncHandler(async (req, res) => {
        const courses = await Course.findAll();
        sendSuccess(res, 200, 'Courses retrieved successfully', courses);
    });

    /**
     * Get course by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        
        const course = await Course.getById(id);
        if (!course) {
            throw new NotFoundError('Course');
        }

        sendSuccess(res, 200, 'Course retrieved successfully', course);
    });

    /**
     * Create a new course
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static create = asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }

        const { course, start_date, end_date, status, description } = req.body;

        // Validate required fields
        if (!course || !start_date || !end_date || !status) {
            throw new ValidationError('Missing required fields: course, start_date, end_date, status');
        }

        // Validate dates
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new ValidationError('Invalid date format');
        }
        
        if (startDate >= endDate) {
            throw new ValidationError('Start date must be before end date');
        }

        const newCourse = await Course.create({
            course,
            start_date,
            end_date,
            status,
            description
        });

        sendSuccess(res, 201, 'Course created successfully', newCourse);
    });

    /**
     * Update an existing course
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static update = asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }

        const { id } = req.params;
        const { course, start_date, end_date, status, description } = req.body;

        // Validate required fields
        if (!course || !start_date || !end_date || !status) {
            throw new ValidationError('Missing required fields: course, start_date, end_date, status');
        }

        // Validate dates
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new ValidationError('Invalid date format');
        }
        
        if (startDate >= endDate) {
            throw new ValidationError('Start date must be before end date');
        }

        const updatedCourse = await Course.update(id, {
            course,
            start_date,
            end_date,
            status,
            description
        });

        if (!updatedCourse) {
            throw new NotFoundError('Course');
        }

        sendSuccess(res, 200, 'Course updated successfully', updatedCourse);
    });

    /**
     * Delete a course
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static delete = asyncHandler(async (req, res) => {
        const { id } = req.params;
        
        const result = await Course.delete(id);
        if (!result) {
            throw new NotFoundError('Course');
        }

        sendSuccess(res, 200, 'Course deleted successfully');
    });

    /**
     * Enroll a student in a course
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static enrollStudent = asyncHandler(async (req, res) => {
        const { courseId, studentId } = req.body;

        if (!courseId || !studentId) {
            throw new ValidationError('courseId and studentId are required');
        }

        const result = await Course.enrollStudent(courseId, studentId);
        sendSuccess(res, 200, 'Student enrolled successfully', result);
    });

    /**
     * Remove a student from a course
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static removeStudent = asyncHandler(async (req, res) => {
        const { courseId, studentId } = req.body;

        if (!courseId || !studentId) {
            throw new ValidationError('courseId and studentId are required');
        }

        const result = await Course.removeStudent(courseId, studentId);
        sendSuccess(res, 200, 'Student removed from course successfully', result);
    });

    /**
     * Get students enrolled in a course
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getEnrolledStudents = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const students = await Course.getEnrolledStudents(id, {
            page: parseInt(page),
            limit: parseInt(limit)
        });

        sendSuccess(res, 200, 'Enrolled students retrieved successfully', students);
    });

    /**
     * Get course statistics
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getStats = asyncHandler(async (req, res) => {
        const stats = await Course.getStats();
        sendSuccess(res, 200, 'Course statistics retrieved successfully', stats);
    });

    /**
     * Get courses with search and filters
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static search = asyncHandler(async (req, res) => {
        const { search = '', status, page = 1, limit = 10 } = req.query;

        const courses = await Course.search({
            search,
            status,
            page: parseInt(page),
            limit: parseInt(limit)
        });

        sendSuccess(res, 200, 'Courses search completed successfully', courses);
    });

    /**
     * Get active courses
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getActive = asyncHandler(async (req, res) => {
        const { page = 1, limit = 10 } = req.query;

        const courses = await Course.getActive({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        sendSuccess(res, 200, 'Active courses retrieved successfully', courses);
    });
}

export default CourseController;