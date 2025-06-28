/**
 * Module Routes
 * Handles all module-related API endpoints with proper validation and authorization
 */

import { Router } from 'express';
import { body, param } from 'express-validator';
import ModuleController from '../controllers/moduleController.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
import { moduleValidation, idValidation, paginationValidation } from '../utils/validation.js';

const router = Router();

/**
 * Validation for student enrollment
 */
const enrollmentValidation = [
    body('moduleId')
        .isInt({ min: 1 })
        .withMessage('Module ID must be a valid positive integer'),
    body('studentId')
        .isInt({ min: 1 })
        .withMessage('Student ID must be a valid positive integer')
];

/**
 * Validation for teacher assignment
 */
const teacherAssignmentValidation = [
    body('moduleId')
        .isInt({ min: 1 })
        .withMessage('Module ID must be a valid positive integer'),
    body('teacherId')
        .isInt({ min: 1 })
        .withMessage('Teacher ID must be a valid positive integer')
];

/**
 * Validation for course ID
 */
const courseIdValidation = param('courseId')
    .isInt({ min: 1 })
    .withMessage('Course ID must be a valid positive integer');

// Public routes (no authentication required)
router.get('/',
    [
        paginationValidation.page,
        paginationValidation.limit,
        paginationValidation.search
    ],
    ModuleController.getAll
);

router.get('/search',
    [
        paginationValidation.page,
        paginationValidation.limit,
        paginationValidation.search
    ],
    ModuleController.search
);

router.get('/stats', ModuleController.getStats);

// Protected routes (authentication required)
router.use(verifyToken);

// Routes for administrators and teachers
router.get('/:id',
    idValidation.moduleId,
    checkRole(['administrador', 'profesor']),
    ModuleController.getById
);

router.get('/:id/students',
    [
        idValidation.moduleId,
        paginationValidation.page,
        paginationValidation.limit
    ],
    checkRole(['administrador', 'profesor']),
    ModuleController.getEnrolledStudents
);

router.get('/:id/teachers',
    idValidation.moduleId,
    checkRole(['administrador', 'profesor']),
    ModuleController.getAssignedTeachers
);

router.get('/course/:courseId',
    [
        courseIdValidation,
        paginationValidation.page,
        paginationValidation.limit
    ],
    checkRole(['administrador', 'profesor']),
    ModuleController.getByCourse
);

// Admin-only routes
router.post('/',
    [
        moduleValidation.name,
        moduleValidation.description.optional(),
        moduleValidation.courseId
    ],
    checkRole(['administrador']),
    ModuleController.create
);

router.put('/:id',
    [
        idValidation.moduleId,
        moduleValidation.name.optional(),
        moduleValidation.description.optional(),
        moduleValidation.courseId.optional()
    ],
    checkRole(['administrador']),
    ModuleController.update
);

router.delete('/:id',
    idValidation.moduleId,
    checkRole(['administrador']),
    ModuleController.delete
);

router.post('/enroll-student',
    enrollmentValidation,
    checkRole(['administrador', 'profesor']),
    ModuleController.enrollStudent
);

router.post('/remove-student',
    enrollmentValidation,
    checkRole(['administrador', 'profesor']),
    ModuleController.removeStudent
);

router.post('/assign-teacher',
    teacherAssignmentValidation,
    checkRole(['administrador']),
    ModuleController.assignTeacher
);

router.post('/remove-teacher',
    teacherAssignmentValidation,
    checkRole(['administrador']),
    ModuleController.removeTeacher
);

export default router;

