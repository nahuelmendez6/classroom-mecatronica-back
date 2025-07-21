import sequelize from '../config/sequalize.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import User from '../models/user.model.js';
import Admin from '../models/admin.model.js';
import Role from '../models/role.model.js';
import {AppError} from '../utils/errorHandler.js'; // Asegurate de tener tu clase de error personalizada

export async function createAdminWithUser(adminData) {
  const t = await sequelize.transaction();
  try {
    const {
      email,
      password,
      name,
      lastname,
      dni,
      phone_number
    } = adminData;

    const finalPassword = password || dni;

    // Buscar el rol de Administrador
    const adminRole = await Role.findOne({ where: { name: 'Administrador' } }, { transaction: t });
    if (!adminRole) {
      throw new AppError("El rol 'Administrador' no está configurado en el sistema.", 500);
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
      id_role: adminRole.id_role
    }, { transaction: t });

    // Crear el admin vinculado
    const newAdmin = await Admin.create({
      id_user: newUser.id_user,
      name,
      lastname
    }, { transaction: t });

    await t.commit();
    return newAdmin;
  } catch (error) {
    await t.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new AppError('El email o DNI ya están registrados.', 409);
    }
    console.error("Error en createAdminWithUser:", error);
    throw new AppError('Error interno al crear el administrador.', 500);
  }
}
