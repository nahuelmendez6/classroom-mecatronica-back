import express from 'express';
import groupController from './group.controller.js';

const router = express.Router();

router.get('/', groupController.getAllGroups);
router.get('/:id', groupController.getGroupById);
router.post('/', groupController.createGroup);
router.patch('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);

// Opcionales
router.get('/by-course/:id_course', groupController.getGroupsByCourse);
router.get('/by-organization/:id_organization', groupController.getGroupsByOrganization);

export default router;
