import bcrypt from 'bcryptjs';
import { Sequelize, DataTypes, Op } from 'sequelize';
import sequelize from '../config/sequalize.js';

const User = sequelize.define('User', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_role: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  last_login: {
    type: DataTypes.DATE,
  }
}, {
  tableName: 'user',
  timestamps: false,
});

/**
 * Métodos estáticos para el modelo User
 */
User.searchUser = async function(email) {
  return await User.findOne({ where: { email } });
};

User.authUser = async function(email, password) {
  const user = await this.searchUser(email);
  if (!user) throw new Error('Usuario no encontrado');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Contraseña incorrecta');

  return user;
};

User.getUserById = async function(id) {
  return await User.findOne({ where: { id_user: id } });
};

User.getTeachers = async function() {
  return await User.findAll({
    where: { id_role: 2, is_deleted: false },
    include: [{ model: Teacher, required: false }]
  });
};

User.updateUser = async function(id, userData) {
  const [affectedRows] = await User.update(userData, { where: { id_user: id } });
  return affectedRows > 0;
};

User.deleteUser = async function(id_user) {
  const [affectedRows] = await User.update({ is_deleted: true }, { where: { id_user } });
  return affectedRows > 0;
};

User.getAllUsers = async function() {
  // Construimos el query con includes y atributos personalizados
  // Sequelize no hace CASE en includes fácilmente, así que podemos usar raw queries o mapear después.

  // Usaré raw query para simplificar:
  const query = `
    SELECT 
      u.id_user,
      u.email,
      u.is_active,
      r.name as role_name,
      CASE r.name
          WHEN 'Estudiante' THEN s.name
          WHEN 'Profesor' THEN t.name
          WHEN 'Administrador' THEN a.name
      END as name,
      CASE r.name
          WHEN 'Estudiante' THEN s.lastname
          WHEN 'Profesor' THEN t.lastname
          WHEN 'Administrador' THEN a.lastname
      END as lastname,
      s.dni,
      CASE r.name
          WHEN 'Estudiante' THEN s.observations
          WHEN 'Profesor' THEN t.observations
          ELSE NULL
      END as observations
    FROM user u
    LEFT JOIN role r ON u.id_role = r.id_role
    LEFT JOIN student s ON u.id_user = s.id_user
    LEFT JOIN teacher t ON u.id_user = t.id_user
    LEFT JOIN admin a ON u.id_user = a.id_user
    ORDER BY u.id_user DESC
  `;

  const [results] = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
  return results;
};

User.createUser = async function(userData) {
  return await sequelize.transaction(async (t) => {
    // Obtener nombre del rol
    const role = await Role.findOne({ where: { id_role: userData.id_role }, transaction: t });
    if (!role) throw new Error('Rol no válido');

    const roleName = role.name.toLowerCase().replace(' ', '_');

    if (!userData.dni) throw new Error('DNI requerido');

    const hashedPassword = await bcrypt.hash(userData.dni.toString(), 10);

    // Crear usuario base
    const user = await User.create({
      email: userData.email,
      password: hashedPassword,
      id_role: userData.id_role,
      is_active: true,
    }, { transaction: t });

    // Crear registro según rol
    switch (roleName) {
      case 'estudiante':
        await Student.create({
          id_user: user.id_user,
          name: userData.name,
          lastname: userData.lastname,
          dni: userData.dni,
          phone_number: userData.phone_number,
          observations: userData.observations || null,
        }, { transaction: t });
        break;

      case 'profesor':
        await Teacher.create({
          id_user: user.id_user,
          name: userData.name,
          lastname: userData.lastname,
          phone_number: userData.phone_number,
          observations: userData.observations || null,
        }, { transaction: t });
        break;

      case 'administrador':
        await Admin.create({
          id_user: user.id_user,
          name: userData.name,
          lastname: userData.lastname,
        }, { transaction: t });
        break;

      case 'tutor':
        await CompanyContact.create({
          id_user: user.id_user,
          name: userData.name,
          last_name: userData.lastname,
          email: userData.email,
          position: userData.position,
          phone: userData.phone,
          id_company: userData.id_company,
        }, { transaction: t });
        break;

      default:
        throw new Error('Rol no válido');
    }

    if (roleName === 'estudiante' && userData.id_module) {
      await StudentModule.create({
        id_student: user.id_user,
        id_module: userData.id_module,
        status: 'Asignado',
      }, { transaction: t });
    }

    return user.id_user;
  });
};

User.getAllRoles = async function() {
  return await Role.findAll();
};

User.getAllModules = async function() {
  // Asumo que tienes modelo Module
  const Module = (await import('./module.model.js')).default;
  return await Module.findAll({ where: { is_active: true } });
};

User.updateLastLogin = async function(id) {
  const [affectedRows] = await User.update({ last_login: Sequelize.fn('NOW') }, { where: { id_user: id } });
  return affectedRows > 0;
};

User.authenticateAndCreateSession = async function(email, password, sessionInfo) {
  const user = await User.findOne({ where: { email, is_active: true } });
  
  await Session.recordLoginAttempt({
    email,
    ip_address: sessionInfo.ip_address,
    user_agent: sessionInfo.user_agent,
    status: user ? 'success' : 'failed',
    failure_reason: user ? null : 'Usuario no encontrado',
    id_user: user?.id_user
  });

  if (!user) throw new Error('Usuario no encontrado');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    await Session.recordLoginAttempt({
      email,
      ip_address: sessionInfo.ip_address,
      user_agent: sessionInfo.user_agent,
      status: 'failed',
      failure_reason: 'Contraseña incorrecta',
      id_user: user.id_user
    });
    throw new Error('Contraseña incorrecta');
  }

  if (await Session.hasTooManyActiveSessions(user.id_user)) {
    throw new Error('Demasiadas sesiones activas');
  }

  const sessionId = await Session.createSession({
    id_user: user.id_user,
    ip_address: sessionInfo.ip_address,
    user_agent: sessionInfo.user_agent
  });

  const role = await Role.findByPk(user.id_role);

  return {
    user: {
      id_user: user.id_user,
      email: user.email,
      role
    },
    sessionId
  };
};

User.logout = async function(sessionId) {
  return await Session.closeSession(sessionId);
};

User.getActiveSessions = async function(userId) {
  return await Session.getActiveSessions(userId);
};

User.getUserStats = async function() {
  // Aquí volvemos a hacer la consulta raw para mayor control
  const query = `
    SELECT 
        COUNT(*) as totalUsers,
        SUM(CASE WHEN r.name = 'Estudiante' THEN 1 ELSE 0 END) as totalStudents,
        SUM(CASE WHEN r.name = 'Profesor' THEN 1 ELSE 0 END) as totalTeachers,
        SUM(CASE WHEN r.name = 'Tutor Empresa' THEN 1 ELSE 0 END) as totalTutors,
        SUM(CASE WHEN r.name = 'Administrador' THEN 1 ELSE 0 END) as totalAdmins
    FROM user u
    JOIN role r ON u.id_role = r.id_role
    WHERE u.is_active = 1 AND (u.is_deleted = 0 OR u.is_deleted IS NULL)
  `;

  const [rows] = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });

  return {
    totalUsers: parseInt(rows.totalUsers, 10),
    totalStudents: parseInt(rows.totalStudents, 10),
    totalTeachers: parseInt(rows.totalTeachers, 10),
    totalTutors: parseInt(rows.totalTutors, 10),
    totalAdmins: parseInt(rows.totalAdmins, 10),
  };
};

export default User;
