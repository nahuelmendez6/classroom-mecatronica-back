import sequelize from '../config/sequalize.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import User from '../models/user.model.js';
import Student from '../models/student.model.js';
import Role from '../models/role.model.js';
import { AppError } from '../utils/errorHandler.js';

export async function createStudentWithUser(studentData) {
  const t = await sequelize.transaction();
  try {
    const {
      email,
      password,
      name,
      lastname,
      dni,
      phone_number,
      observations
    } = studentData;

    const finalPassword = password || dni;

    // Buscar el rol de Estudiante
    const studentRole = await Role.findOne({ where: { name: 'Estudiante' } }, { transaction: t });
    if (!studentRole) {
      throw new AppError("El rol 'Estudiante' no está configurado en el sistema.", 500);
    }

    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    // Crear el usuario
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      lastname,
      dni,
      phone_number,
      id_role: studentRole.id_role
    }, { transaction: t });

    // Crear el estudiante vinculado
    const newStudent = await Student.create({
      id_user: newUser.id_user,
      name,
      lastname,
      dni,
      phone_number,
      observations
    }, { transaction: t });

    await t.commit();
    return newStudent;
  } catch (error) {
    await t.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new AppError('El email o DNI ya están registrados.', 409);
    }
    console.error("Error en createStudentWithUser:", error);
    throw new AppError('Error interno al crear el estudiante.', 500);
  }
}
