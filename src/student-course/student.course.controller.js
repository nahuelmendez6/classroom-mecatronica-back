import StudentCourseRepository from './student.course.repository.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

class StudentCourseController {
  // Obtener todas las inscripciones
  static async getAll(req, res) {
    try {
      const enrollments = await StudentCourseRepository.findAll();
      sendSuccess(res, 200, 'Inscripciones obtenidas correctamente', enrollments);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Obtener inscripción por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const enrollment = await StudentCourseRepository.findById(id);

      if (!enrollment) return sendError(res, 404, 'Inscripción no encontrada');
      sendSuccess(res, 200, 'Inscripción obtenida correctamente', enrollment);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Crear nueva inscripción
  static async create(req, res) {
    try {
      const enrollmentData = req.body;
      const newEnrollment = await StudentCourseRepository.create(enrollmentData);
      sendSuccess(res, 201, 'Inscripción creada correctamente', newEnrollment);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Actualizar inscripción
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedEnrollment = await StudentCourseRepository.update(id, updatedData);

      if (!updatedEnrollment) return sendError(res, 404, 'Inscripción no encontrada');
      sendSuccess(res, 200, 'Inscripción actualizada correctamente', updatedEnrollment);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Eliminar inscripción
  static async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await StudentCourseRepository.delete(id);

      if (!deleted) return sendError(res, 404, 'Inscripción no encontrada');
      sendSuccess(res, 200, 'Inscripción eliminada correctamente');
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Obtener inscripciones por estudiante
  static async getByStudentId(req, res) {
    try {
      const { id_student } = req.params;
      const enrollments = await StudentCourseRepository.findByStudentId(id_student);

      sendSuccess(res, 200, 'Inscripciones del estudiante obtenidas correctamente', enrollments);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Obtener inscripciones por curso
  static async getByCourseId(req, res) {
    try {
      const { id_course } = req.params;
      const enrollments = await StudentCourseRepository.findByCourseId(id_course);

      sendSuccess(res, 200, 'Inscripciones del curso obtenidas correctamente', enrollments);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }
}

export default StudentCourseController;
