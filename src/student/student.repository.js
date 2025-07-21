import Student from './student.model.js';
import User from '../models/user.model.js';
import { Op } from 'sequelize';

class StudentRepository {
  // Obtener todos los estudiantes (puede incluir datos del usuario)
  async findAll() {
    return await Student.findAll({
      include: [{ model: User, as: 'user' }]
    });
  }

  // Buscar un estudiante por ID
  async findById(id_student) {
    return await Student.findByPk(id_student, {
      include: [{ model: User, as: 'user' }]
    });
  }

  // Buscar estudiante por id_user
  async findByUserId(id_user) {
    return await Student.findOne({
      where: { id_user },
      include: [{ model: User, as: 'user' }]
    });
  }

  // Crear estudiante
  async create(studentData, transaction = null) {
    return await Student.create(studentData, { transaction });
  }

  // Actualizar estudiante
  async update(id_student, updatedData, transaction = null) {
    const student = await Student.findByPk(id_student);
    if (!student) return null;

    return await student.update(updatedData, { transaction });
  }

  // Eliminar estudiante
  async delete(id_student) {
    return await Student.destroy({ where: { id_student } });
  }
}

export default new StudentRepository();
