// routes/activityResponse.routes.js
import express from 'express';
import ActivityResponseController from './activity.reponse.controller.js';
import { upload } from '../middleware/upload.js';


const router = express.Router();

router.post('/', ActivityResponseController.create);
router.post(
  '/with-files',
  upload.array('attachments', 10), // hasta 10 archivos por defecto
  ActivityResponseController.createWithFiles
);

router.get('/:id', ActivityResponseController.getById);
router.get('/student/:id_student', ActivityResponseController.getByStudent);
router.get('/activity/:id_activity', ActivityResponseController.getByActivityId);
router.patch('/:id', ActivityResponseController.update);
router.delete('/:id', ActivityResponseController.remove);

export default router;
