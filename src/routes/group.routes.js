import express from 'express';
import GroupController from '../controllers/group.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
// Assuming you have validation for group data, e.g., groupValidation
// import { groupValidation } from '../utils/validation.js';

const router = express.Router();

// All group routes require authentication
router.use(verifyToken);

// CRUD operations for Groups
router.post('/', checkRole(['administrador', 'profesor']), GroupController.createGroup);
router.get('/', checkRole(['administrador', 'profesor']), GroupController.getAllGroups);
router.get('/:id', checkRole(['administrador', 'profesor']), GroupController.getGroupById);
router.patch('/:id', checkRole(['administrador']), GroupController.updateGroup);
router.delete('/:id', checkRole(['administrador']), GroupController.deleteGroup);

// Group-Student operations
router.post('/:groupId/students', checkRole(['administrador']), GroupController.addStudentToGroup);
router.delete('/:groupId/students/:studentId', checkRole(['administrador']), GroupController.removeStudentFromGroup);
router.get('/:groupId/students', checkRole(['administrador', 'profesor']), GroupController.getStudentsInGroup);

export default router;