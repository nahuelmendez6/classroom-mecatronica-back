import Course from '../models/Course.js';
import Module from '../models/module.model.js';
import StudentCourse from '../models/student.course.js';
import Student from '../models/student.model.js';
import { AppError, NotFoundError } from '../utils/errorHandler.js';

class CourseService {
  static async getAllCourses() {
    try {
      const courses = await Course.findAll({
        include: [
          {
            model: Module,
            as: 'modulos'
          }
        ]
      });
      return courses;
    } catch (error) {
      throw new AppError('Error al obtener los cursos', 500);
    }
  }

  static async getCourseById(id) {
    const course = await Course.getById(id);
    if (!course) {
      throw new NotFoundError('Curso');
    }
    return course;
  }

  static async createCourse(courseData) {
    const { course, start_date, end_date, status, description } = courseData;

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (startDate >= endDate) {
      throw new AppError('La fecha de inicio debe ser anterior a la fecha de finalización', 400);
    }

    try {
      const newCourse = await Course.create({
        course,
        start_date,
        end_date,
        status,
        description
      });
      return newCourse;
    } catch (error) {
      throw new AppError('Error al crear el curso', 500);
    }
  }

  static async updateCourse(id, courseData) {
    const { course, start_date, end_date, status, description } = courseData;

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (startDate >= endDate) {
      throw new AppError('La fecha de inicio debe ser anterior a la fecha de finalización', 400);
    }

    try {
      const updatedCourse = await Course.update(id, {
        course,
        start_date,
        end_date,
        status,
        description
      });
      return updatedCourse;
    } catch (error) {
      if (error.message === 'Curso no encontrado') {
        throw new NotFoundError('Curso');
      }
      throw new AppError('Error al actualizar el curso', 500);
    }
  }

  static async deleteCourse(id) {
    try {
      await Course.delete(id);
    } catch (error) {
      if (error.message === 'Curso no encontrado') {
        throw new NotFoundError('Curso');
      }
      if (error.message.includes('módulos asociados')) {
        throw new AppError(error.message, 400);
      }
      throw new AppError('Error al eliminar el curso', 500);
    }
  }

  static async enrollStudent(courseId, studentId) {
    try {
      const result = await Course.enrollStudent(courseId, studentId);
      return result;
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  static async getStudentsByCourse(courseId) {
    const course = await Course.findByPk(courseId, {
      include: {
        model: Student,
        through: {
          model: StudentCourse,
          attributes: ['enrollment_date', 'status']
        }
      }
    });

    if (!course) {
      throw new NotFoundError('Curso');
    }

    return course.Students.map(student => ({
      id_student: student.id_student,
      name: student.name,
      lastname: student.lastname,
      dni: student.dni,
      enrollment_date: student.StudentCourse.enrollment_date,
      status: student.StudentCourse.status
    }));
  }
}

export default CourseService;

