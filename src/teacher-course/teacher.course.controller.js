import TeacherCourseRepository from './teacher.course.repository.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

class TeacherCourseController {
  // Obtener todas las relaciones
  static async getAll(req, res) {
    try {
      const data = await TeacherCourseRepository.findAll();
      sendSuccess(res, 200, 'Relaciones docente-curso obtenidas correctamente', data);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Obtener cursos de un docente específico
  static async getCoursesByTeacher(req, res) {
    try {
      const { id_teacher } = req.params;
      const data = await TeacherCourseRepository.findByTeacherId(id_teacher);
      sendSuccess(res, 200, 'Cursos del docente obtenidos correctamente', data);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Obtener docentes de un curso específico
  static async getTeachersByCourse(req, res) {
    try {
      const { id_course } = req.params;
      const data = await TeacherCourseRepository.findByCourseId(id_course);
      sendSuccess(res, 200, 'Docentes del curso obtenidos correctamente', data);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Crear nueva relación docente-curso
  static async assignTeacherToCourse(req, res) {
    try {
      const { id_teacher, id_course } = req.body;

      const exists = await TeacherCourseRepository.exists(id_teacher, id_course);
      if (exists) {
        return sendError(res, 400, 'La relación ya existe');
      }

      const newRelation = await TeacherCourseRepository.create({ id_teacher, id_course });
      sendSuccess(res, 201, 'Relación creada correctamente', newRelation);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Eliminar relación docente-curso
  static async unassignTeacherFromCourse(req, res) {
    try {
      const { id_teacher, id_course } = req.body;

      const deletedCount = await TeacherCourseRepository.deleteByIds(id_teacher, id_course);

      if (deletedCount === 0) {
        return sendError(res, 404, 'Relación no encontrada');
      }

      sendSuccess(res, 200, 'Relación eliminada correctamente');
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }
}

export default TeacherCourseController;
