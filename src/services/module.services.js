import { Module, Course, Teacher, Student, LearningMaterial, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

class ModuleService {
  static async getAll() {
    try {
      const modules = await Module.findAll({
        attributes: [
          ['id_module', 'id'],
          ['name', 'nombre'],
          ['description', 'descripcion'],
          ['duration', 'duracion'],
          ['icon_url', 'icono'],
          [sequelize.col('Course.course'), 'curso'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('student_modules.id_student'))), 'total_alumnos'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('learning_materials.id_material'))), 'total_materiales'],
          [sequelize.fn('GROUP_CONCAT', sequelize.literal("DISTINCT CONCAT(teachers.name, ' ', teachers.lastname)")), 'profesores'],
        ],
        include: [
          {
            model: Course,
            attributes: [],
          },
          {
            model: Teacher,
            through: { attributes: [] },
            attributes: [],
          },
          {
            model: Student,
            through: { attributes: [] },
            as: 'student_modules',
            attributes: [],
          },
          {
            model: LearningMaterial,
            attributes: [],
          },
        ],
        group: ['Module.id_module'],
        order: [['name', 'ASC']],
        raw: true,
      });

      return modules.map(m => ({
        ...m,
        profesores: m.profesores ? m.profesores.split(',') : [],
        submodulos: []
      }));
    } catch (error) {
      throw new Error('Error al obtener los módulos: ' + error.message);
    }
  }

  static async create(moduleData) {
    const { nombre, descripcion, icono, id_profesor, duracion, id_course } = moduleData;

    const transaction = await sequelize.transaction();
    try {
      const newModule = await Module.create({
        name: nombre,
        description: descripcion,
        icon_url: icono,
        duration: duracion,
        id_course: id_course,
      }, { transaction });

      if (id_profesor) {
        await newModule.addTeacher(id_profesor, { transaction });
      }

      await transaction.commit();
      return { id: newModule.id_module };
    } catch (error) {
      await transaction.rollback();
      throw new Error('Error al crear el módulo: ' + error.message);
    }
  }

  static async delete(id) {
    const transaction = await sequelize.transaction();
    try {
      const module = await Module.findByPk(id);
      if (!module) throw new Error('Módulo no encontrado');

      await module.setTeachers([], { transaction });
      await module.setStudents([], { transaction });
      await LearningMaterial.destroy({ where: { id_module: id }, transaction });

      await module.destroy({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw new Error('Error al eliminar el módulo: ' + error.message);
    }
  }

  static async getStats() {
    try {
      const stats = await Module.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Module.id_module'))), 'totalModulos'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('learning_materials.id_material'))), 'totalSubmodulos'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.literal(`CASE WHEN student_modules.status = 'En Progreso' THEN student_modules.id_student END`))), 'alumnosActivos'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('teachers.id_teacher'))), 'profesoresAsignados'],
        ],
        include: [
          {
            model: LearningMaterial,
            attributes: [],
          },
          {
            model: Student,
            through: { attributes: ['status'] },
            as: 'student_modules',
            attributes: [],
          },
          {
            model: Teacher,
            attributes: [],
            through: { attributes: [] },
          },
        ],
        raw: true,
      });

      return stats[0];
    } catch (error) {
      throw new Error('Error al obtener estadísticas: ' + error.message);
    }
  }

  static async enrollStudent(moduleId, studentId) {
    try {
      // Validar inscripción existente
      const module = await Module.findByPk(moduleId);
      const alreadyEnrolled = await module.hasStudent(studentId);
      if (alreadyEnrolled) {
        throw new Error('El estudiante ya está inscrito en este módulo');
      }

      // Validar que el estudiante esté en el curso correcto
      const studentCourses = await sequelize.query(
        'SELECT id_course FROM student_course WHERE id_student = ?',
        {
          replacements: [studentId],
          type: sequelize.QueryTypes.SELECT,
        }
      );
      const studentCourseId = studentCourses[0]?.id_course;

      if (!studentCourseId || studentCourseId !== module.id_course) {
        throw new Error('El estudiante no está inscrito en el curso correspondiente al módulo');
      }

      await module.addStudent(studentId);
    } catch (error) {
      throw new Error('Error al inscribir estudiante en el módulo: ' + error.message);
    }
  }
}

export default ModuleService;
