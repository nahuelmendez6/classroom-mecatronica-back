import Course from '../models/Course.js';
import Module from '../models/module.model.js';
import StudentCourse from '../models/student.course.js';
import Student from '../models/student.model.js';
import sequelize from '../config/sequalize.js';
import TeacherCourse from '../models/teacher.course.model.js';
import Teacher from '../models/teacher.model.js';
import User from '../models/user.model.js'; // Added
import { AppError, NotFoundError } from '../utils/errorHandler.js';

class CourseService {
  static async getAllCourses() {
    try {
      const courses = await Course.findAll({
        include: [
          {
            model: Module,
            as: 'modulos'
          },
          {
            model: Teacher,
            through: TeacherCourse,
            as: 'teachers',
            attributes: ['id_teacher', 'name', 'lastname']
          }
        ]
      });
      return courses;
    } catch (error) {
      console.error('Error in getAllCourses:', error); // Added for debugging
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
    const { course, start_date, end_date, status, description, id_teacher } = courseData;

    const t = await sequelize.transaction();

    try {
      if (start_date && end_date) {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        if (startDate >= endDate) {
          throw new AppError('La fecha de inicio debe ser anterior a la fecha de finalización', 400);
        }
      }

      const courseToUpdate = await Course.findByPk(id);
      if (!courseToUpdate) {
        throw new NotFoundError('Curso');
      }

      const updatedCourse = await courseToUpdate.update({
        course,
        start_date,
        end_date,
        status,
        description
      }, { transaction: t });

      if (id_teacher !== undefined && id_teacher !== null) {
        await TeacherCourse.destroy({
          where: { id_course: id },
          transaction: t
        });

        if (id_teacher !== '') {
          await TeacherCourse.create({
            id_course: id,
            id_teacher: id_teacher
          }, { transaction: t });
        }
      }

      await t.commit();
      return updatedCourse;
    } catch (error) {
      await t.rollback();
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError(`Error al actualizar el curso: ${error.message}`, 500);
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
        },
        include: { // Nested include for User model
          model: User,
          attributes: ['email'] // Only get email from User
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
      email: student.User ? student.User.email : null, // Get email from User model
      dni: student.dni,
      phone_number: student.phone_number, // phone_number is directly on Student model
      enrollment_date: student.StudentCourse.enrollment_date,
      status: student.StudentCourse.status
    }));
  }
}

export default CourseService;

