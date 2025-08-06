import StudentCourse from './student.course.model.js';
import { Student, User } from '../models/index.js';

class StudentCourseRepository {
  // Obtener todas las inscripciones
  async findAll() {
    return await StudentCourse.findAll();
  }

  // Buscar inscripción por ID
  async findById(id) {
    return await StudentCourse.findByPk(id);
  }

  // Crear una inscripción nueva
  async create(data, transaction = null) {
    return await StudentCourse.create(data, { transaction });
  }

  // Actualizar inscripción por ID
  async update(id, updatedData, transaction = null) {
    const enrollment = await this.findById(id);
    if (!enrollment) return null;

    return await enrollment.update(updatedData, { transaction });
  }

  // Eliminar inscripción por ID
  async delete(id) {
    return await StudentCourse.destroy({ where: { id_student_course: id } });
  }

  // Buscar inscripciones por estudiante
  async findByStudentId(id_student) {
    return await StudentCourse.findAll({ where: { id_student } });
  }

  // Buscar inscripciones por curso
  async findByCourseId(id_course) {
    // return await StudentCourse.findAll({ where: { id_course } });
     return await StudentCourse.findAll({
      where: { id_course },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id_student', 'name', 'lastname', 'dni', 'phone_number', 'observations'],
          include: [
            {
              model: User,
              as: 'user_student',
              attributes: ['id_user', 'email']
            }
          ]
        }
      ]
    });
  }
}

export default new StudentCourseRepository();
