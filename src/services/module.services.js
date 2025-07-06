import { Module, Course, Teacher, Student, LearningMaterial, sequelize } from '../models/index.js';
import { AppError, NotFoundError } from '../utils/errorHandler.js';

class ModuleService {
  static async getAll() {
    try {
      const modules = await Module.getAll();
      const result = modules.map(module => {
        const profesores = module.moduleTeachers.map(mt => ({
          id_teacher: mt.teacher.id_teacher,
          nombre: mt.teacher.User.first_name + ' ' + mt.teacher.User.last_name,
        }));

        return {
          ...module.toJSON(),
          submodules: module.submodules.map(sub => ({
            ...sub.toJSON(),
            profesor: profesores[0] || null
          })),
          teachers: profesores
        };
      });
      return result;
    } catch (error) {
      throw new AppError('Error al obtener los módulos', 500);
    }
  }

  static async create(moduleData) {
    try {
      const result = await Module.create(moduleData);
      return result;
    } catch (error) {
      throw new AppError('Error al crear el módulo', 500);
    }
  }

  static async delete(id) {
    try {
      await Module.delete(id);
    } catch (error) {
      throw new AppError('Error al eliminar el módulo', 500);
    }
  }

  static async getStats() {
    try {
      const stats = await Module.getStats();
      return stats;
    } catch (error) {
      throw new AppError('Error al obtener estadísticas', 500);
    }
  }

  static async enrollStudent(moduleId, studentId) {
    try {
      const result = await Module.enrollStudent(moduleId, studentId);
      return result;
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
}

export default ModuleService;

