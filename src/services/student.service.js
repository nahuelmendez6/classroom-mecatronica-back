// services/student.service.js
import bcrypt from 'bcryptjs';
import sequelize from '../config/sequalize.js';
import User from '../models/user.model.js';
import Student from '../models/student.model.js';
import StudentCourse from '../models/student.course.js';
import Role from '../models/role.model.js';
import { AppError, NotFoundError, ConflictError } from '../utils/errorHandler.js';

class StudentService {
  static async createStudentWithUser(studentData) {
    const t = await sequelize.transaction();
    try {
      const { email, password, name, lastname, dni, phone_number, observations, id_course } = studentData;

      const studentRole = await Role.findOne({ where: { name: 'Estudiante' } }, { transaction: t });
      if (!studentRole) {
        throw new AppError("El rol 'Estudiante' no se encuentra configurado en el sistema.", 500);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        password: hashedPassword,
        name,
        lastname,
        dni,
        phone_number,
        id_role: studentRole.id_role
      }, { transaction: t });

      const newStudent = await Student.create({
        id_user: newUser.id_user,
        name,
        lastname,
        dni,
        phone_number,
        observations
      }, { transaction: t });

      await StudentCourse.create({
        id_student: newStudent.id_student,
        id_course: id_course
      }, { transaction: t });

      await t.commit();
      return newStudent;
    } catch (error) {
      await t.rollback();
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictError('El email o DNI ya está registrado.');
      }
      throw new AppError('Error interno del servidor al crear el estudiante.', 500);
    }
  }

  static async createStudentUser(studentData) {
    const { email, dni, name, lastname, phone_number, observations, id_course } = studentData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictError('El email ya está registrado');
    }

    const existingStudent = await Student.findOne({ where: { dni } });
    if (existingStudent) {
      throw new ConflictError('El DNI ya está registrado como estudiante');
    }

    const hashedPassword = await bcrypt.hash(dni.toString(), 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      id_role: 3, // Assuming role 3 is for students
      name,
      lastname,
      dni,
      phone_number,
    });

    const newStudent = await Student.create({
      id_user: newUser.id_user,
      name,
      lastname,
      dni,
      phone_number,
      observations
    });

    await StudentCourse.create({
      id_student: newStudent.id_student,
      id_course
    });

    return {
      id_user: newUser.id_user,
      id_student: newStudent.id_student
    };
  }

  static async getAllStudents() {
    try {
      const students = await Student.findAll();
      return students;
    } catch (error) {
      throw new AppError('Error al obtener los estudiantes.', 500);
    }
  }
}

export default StudentService;
