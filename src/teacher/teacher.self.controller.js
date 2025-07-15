import {
  getTeacherCourses,
  getTeacherGroups,
  getTeacherModules,  
} from './teacher.service.js'
import { sendSuccess, sendError } from '../utils/responseHandler.js';

class TeacherSelfController {
  static async getTeacherCourses(req, res) {
    try {
      const userId = req.user.id_user;
      const courses = await getTeacherCourses(userId);
      sendSuccess(res, 200, 'Cursos del profesor obtenidos correctamente', courses);
    } catch (error) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  static async getTeacherGroups(req, res) {
    try {
      const userId = req.user.id_user;
      const groups = await getTeacherGroups(userId);
      sendSuccess(res, 200, 'Grupos del profesor obtenidos correctamente', groups);
    } catch (error) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  static async getTeacherModules(req, res) {
    try {
      const userId = req.user.id_user;
      const modules = await getTeacherModules(userId);
      sendSuccess(res, 200, 'Módulos del profesor obtenidos correctamente', modules);
    } catch (error) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export default TeacherSelfController;
