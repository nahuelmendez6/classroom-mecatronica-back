import { Router } from 'express';
import {
    createAssignment,
    getAllAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment
} from '../controllers/studentPracticeAssignment.controller.js';

import { verifyToken, checkRole } from '../middleware/auth.middleware.js';

const router = Router();

// Roles permitidos
const allowedRoles = ['administrador', 'profesor'];

// Crear nueva asignación
router.post(
    '/',
    verifyToken,
    checkRole(allowedRoles),
    createAssignment
);

// Obtener todas las asignaciones
router.get(
    '/',
    verifyToken,
    checkRole(allowedRoles),
    getAllAssignments
);

// Obtener una asignación por ID
router.get(
    '/:id',
    verifyToken,
    checkRole(allowedRoles),
    getAssignmentById
);

// Actualizar una asignación por ID
router.put(
    '/:id',
    verifyToken,
    checkRole(allowedRoles),
    updateAssignment
);

// Eliminar una asignación por ID
router.delete(
    '/:id',
    verifyToken,
    checkRole(allowedRoles),
    deleteAssignment
);

export default router;
