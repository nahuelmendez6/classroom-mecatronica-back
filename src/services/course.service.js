// services/course.service.js
import Course from '../models/course.js';
import Module from '../models/module.js';
import StudentModule from '../models/student_module.js';
import ModuleTeacher from '../models/module_teacher.js';
import StudentCourse from '../models/student_course.js';
import Student from '../models/student.js';
import Teacher from '../models/teacher.js';
import sequelize from '../config/sequelize.js';
import { Op } from 'sequelize';

class CourseService {
  static async getAll() {
    try {
      const courses = await Course.findAll({
        attributes: {
          include: [
            [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Modules.id_module'))), 'total_modules'],
            [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Modules.StudentModules.id_student'))), 'total_students'],
            [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Modules.ModuleTeachers.id_teacher'))), 'total_teachers'],
          ]
        },
        include: [
          {
            model: Module,
            attributes: [],
            include: [
              { model: StudentModule, attributes: [] },
              { model: ModuleTeacher, attributes: [] }
            ]
          }
        ],
        group: ['Course.id_course'],
        order: [['start_date', 'DESC']]
      });
      return courses;
    } catch (error) {
      throw new Error('Error al obtener los cursos: ' + error.message);
    }
  }

  static async getById(id) {
    try {
      const course = await Course.findOne({
        where: { id_course: id },
        attributes: {
          include: [
            [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Modules.id_module'))), 'total_modules'],
            [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Modules.StudentModules.id_student'))), 'total_students'],
            [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Modules.ModuleTeachers.id_teacher'))), 'total_teachers'],
          ]
        },
        include: [
          {
            model: Module,
            attributes: [],
            include: [
              { model: StudentModule, attributes: [] },
              { model: ModuleTeacher, attributes: [] }
            ]
          }
        ],
        group: ['Course.id_course']
      });

      return course;
    } catch (error) {
      throw new Error('Error al obtener el curso: ' + error.message);
    }
  }

  static async create(data) {
    try {
      const course = await Course.create(data);
      return course;
    } catch (error) {
      throw new Error('Error al crear el curso: ' + error.message);
    }
  }

  static async update(id, data) {
    try {
      const [updated] = await Course.update(data, { where: { id_course: id } });
      if (!updated) throw new Error('Curso no encontrado');
      return { id_course: id, ...data };
    } catch (error) {
      throw new Error('Error al actualizar el curso: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const moduleCount = await Module.count({ where: { id_course: id } });
      if (moduleCount > 0) {
        throw new Error('No se puede eliminar el curso porque tiene módulos asociados');
      }

      const deleted = await Course.destroy({ where: { id_course: id } });
      if (!deleted) throw new Error('Curso no encontrado');
      return true;
    } catch (error) {
      throw new Error('Error al eliminar el curso: ' + error.message);
    }
  }

  static async enrollStudent(courseId, studentId) {
    try {
      const exists = await StudentCourse.findOne({
        where: {
          id_course: courseId,
          id_student: studentId
        }
      });
      if (exists) throw new Error('El estudiante ya está inscrito en este curso');

      await StudentCourse.create({ id_course: courseId, id_student: studentId });
      return { id_course: courseId, id_student: studentId };
    } catch (error) {
      throw new Error('Error al inscribir estudiante en el curso: ' + error.message);
    }
  }
}

export default CourseService;
