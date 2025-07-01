import express from 'express';
import { assignStudentToCourse } from '../controllers/student.course.js';

const router = express.Router();

router.post('/', assignStudentToCourse);

export default router;




