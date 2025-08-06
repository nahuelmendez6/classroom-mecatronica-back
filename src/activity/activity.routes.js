import express from 'express';
import multer from 'multer';
import activityController from './activity.controller.js';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

// Rutas CRUD
router.get('/activities', activityController.getAll);
router.get('/activities/:id', activityController.getById);
router.post('/activities', upload.array('attachments'), activityController.create);
router.patch('/activities/:id', upload.array('attachments'), activityController.update);
router.delete('/activities/:id', activityController.remove);

// Actividades por curso
router.get('/courses/:courseId/activities', activityController.getByCourse);
// Actividades por profesor
router.get('/by-teacher/:teacherId/activities', activityController.getByTeacher);

export default router;
