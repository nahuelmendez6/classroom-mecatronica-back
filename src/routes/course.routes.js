/**
 * Course Routes
 * Handles all course-related API endpoints with proper validation and authorization
 */

import { Router } from 'express';
import { body, param } from 'express-validator';
import CourseController from '../controllers/course.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
import { courseValidation, idValidation, paginationValidation } from '../utils/validation.js';

const router = Router();

/**
 * Validation for course enrollment
 */
const enrollmentValidation = [
    body('courseId')
        .isInt({ min: 1 })
        .withMessage('Course ID must be a valid positive integer'),
    body('studentId')
        .isInt({ min: 1 })
        .withMessage('Student ID must be a valid positive integer')
];

/**
 * Validation for course dates
 */
const dateValidation = [
    body('start_date')
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    body('end_date')
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((value, { req }) => {
            const startDate = new Date(req.body.start_date);
            const endDate = new Date(value);
            if (startDate >= endDate) {
                throw new Error('End date must be after start date');
            }
            return true;
        })
];

/**
 * Validation for course status
 */
const statusValidation = body('status')
    .isIn(['active', 'inactive', 'completed', 'cancelled'])
    .withMessage('Status must be one of: active, inactive, completed, cancelled');

// Public routes (no authentication required)
router.get('/',
    [
        paginationValidation.page,
        paginationValidation.limit,
        paginationValidation.search
    ],
    CourseController.getAll
);

router.get('/search',
    [
        paginationValidation.page,
        paginationValidation.limit,
        paginationValidation.search
    ],
    CourseController.search
);

router.get('/active',
    [
        paginationValidation.page,
        paginationValidation.limit
    ],
    CourseController.getActive
);

router.get('/stats', CourseController.getStats);

// Protected routes (authentication required)
router.use(verifyToken);

// Routes for administrators and teachers
router.get('/:id',
    idValidation.courseId,
    checkRole(['administrador', 'profesor']),
    CourseController.getById
);

router.get('/:id/students',
    [
        idValidation.courseId,
        paginationValidation.page,
        paginationValidation.limit
    ],
    checkRole(['administrador', 'profesor']),
    CourseController.getEnrolledStudents
);

// Admin-only routes
router.post('/',
    [
        courseValidation.name,
        courseValidation.description.optional(),
        ...dateValidation,
        statusValidation
    ],
    checkRole(['administrador']),
    CourseController.create
);

router.put('/:id',
    [
        idValidation.courseId,
        courseValidation.name.optional(),
        courseValidation.description.optional(),
        ...dateValidation.map(validation => validation.optional()),
        statusValidation.optional()
    ],
    checkRole(['administrador']),
    CourseController.update
);

router.delete('/:id',
    idValidation.courseId,
    checkRole(['administrador']),
    CourseController.delete
);

router.post('/enroll-student',
    enrollmentValidation,
    checkRole(['administrador', 'profesor']),
    CourseController.enrollStudent
);

router.post('/remove-student',
    enrollmentValidation,
    checkRole(['administrador', 'profesor']),
    CourseController.removeStudent
);

export default router; 