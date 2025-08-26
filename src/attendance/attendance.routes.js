// routes/attendanceRoutes.js
import { Router } from 'express';
import AttendanceController from './attendance.controller.js';

const router = Router();

// Crear asistencia
router.post('/', AttendanceController.create);

// Obtener todas las asistencias
router.get('/', AttendanceController.getAll);

// Obtener asistencia por ID
router.get('/:id', AttendanceController.getById);

// Obtener asistencias por organización
router.get('/organization/:organizationId', AttendanceController.getByOrganization);

// Obtener asistencias de un estudiante
router.get('/student/:studentId', AttendanceController.getByStudent);

// Actualizar asistencia
router.patch('/:id', AttendanceController.update);

// Eliminar asistencia- ,.,.,;,.++¨¨¨+*******
router.delete('/:id', AttendanceController.delete);

export default router;





