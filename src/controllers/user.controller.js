import User from '../models/user.model.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { checkRole } from '../middleware/auth.middleware.js';
import { pool } from '../../config/database.js';
import { asyncHandler, 
    ConflictError,
    NotFoundError,
    AppError,
    AuthenticationError,
    AuthorizationError,
} from '../utils/errorHandler.js';
import { ValidationError } from 'sequelize';
import {
    sendSuccess,
    sendValidationError,
    sendNotFound,
} from '../utils/responseHandler.js';

class UserController {

    static searchUser = asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError('Error de validación', errors.array());
        }

        const { email } = req.body;
        const user = await User.searchUser(email);
        if (!user) {
            throw new NotFoundError('Usuario');
        }

        const { password, ...userWithoutPassword } = user;
        sendSuccess(res, 200, 'Usuario encontrado', userWithoutPassword);
    });

    static createUser = asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError('Error de validación', errors.array());
        }

        const {
            email,
            password,
            confirmPassword,
            name,
            lastname,
            dni,
            phone_number,
            id_role,
            id_module,
            observations,
            id_company,
            phone,
            position
        } = req.body;

        if (password !== confirmPassword) {
            throw new ValidationError('Las contraseñas no coinciden');
        }

        const existingUser = await User.searchUser(email);
        if (existingUser) {
            throw new ConflictError('El email ya está registrado');
        }

        const [roles] = await pool.query('SELECT * FROM role WHERE id_role = ?', [id_role]);
        if (!roles.length) {
            throw new ValidationError('Rol no válido');
        }

        const rawPassword = dni?.toString();
        if (!rawPassword) {
            throw new ValidationError('DNI es requerido para generar contraseña');
        }

        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        const userId = await User.createUser({
            email,
            password: hashedPassword,
            id_role,
            name,
            lastname,
            dni,
            phone_number,
            id_module,
            observations,
            id_company,
            position,
            phone
        });

        sendSuccess(res, 201, 'Usuario creado exitosamente', { id_user: userId });
    });

    static updateUser = asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError('Error de validación', errors.array());
        }

        const { id_user } = req.params;
        const updateData = { ...req.body };

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const success = await User.updateUser(id_user, updateData);
        if (!success) {
            throw new NotFoundError('Usuario');
        }

        sendSuccess(res, 200, 'Usuario actualizado exitosamente');
    });

    static deleteUser = asyncHandler(async (req, res) => {
        const { id_user } = req.params;

        const success = await User.updateUser(id_user, {
            is_active: false,
            is_deleted: true,
            deleted_at: new Date()
        });

        if (!success) throw new NotFoundError('Usuario');

        const sessions = await User.getActiveSessions(id_user);
        for (const session of sessions) {
            await User.logout(session.id_session);
        }

        sendSuccess(res, 200, 'Usuario eliminado exitosamente');
    });

    static getAllUsers = asyncHandler(async (req, res) => {
        const users = await User.getAllUsers();
        const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
        sendSuccess(res, 200, null, usersWithoutPasswords);
    });

    static getAllTeachers = asyncHandler(async (req, res) => {
        const teachers = await User.getTeachers();
        if (!Array.isArray(teachers)) {
            throw new AppError('La respuesta de la base de datos no es un array de profesores', 500);
        }

        const teachersWithoutPassword = teachers.map(({ password, ...rest }) => rest);
        sendSuccess(res, 200, null, teachersWithoutPassword);
    });

    static getUserById = asyncHandler(async (req, res) => {
        const { id_user } = req.params;
        const user = await User.getUserById(id_user);
        if (!user) throw new NotFoundError('Usuario');

        const { password, ...userWithoutPassword } = user;
        sendSuccess(res, 200, null, userWithoutPassword);
    });

    static getAllRoles = asyncHandler(async (req, res) => {
        const roles = await User.getAllRoles();
        sendSuccess(res, 200, null, roles);
    });

    static getAllModules = asyncHandler(async (req, res) => {
        const modules = await User.getAllModules();
        sendSuccess(res, 200, null, modules);
    });

    static getUserStats = asyncHandler(async (req, res) => {
        const stats = await User.getUserStats();
        sendSuccess(res, 200, null, stats);
    });

}


// class UserController {

//     /**
//      * Busca un usuario por email
//      * @param {Object} req - Request object
//      * @param {Object} res - Response object
//      */
//     static async searchUser(req, res) {
//         try {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Error de validación',
//                     errors: errors.array()
//                 });
//             }

//             const { email } = req.body;
//             const user = await User.searchUser(email);

//             if (!user) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Usuario no encontrado'
//                 });
//             }

//             // No devolver la contraseña
//             const { password, ...userWithoutPassword } = user;

//             res.status(200).json({
//                 success: true,
//                 message: 'Usuario encontrado',
//                 data: userWithoutPassword
//             });
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: 'Error al buscar usuario',
//                 error: error.message
//             });
//         }
//     }

//     /**
//      * Crea un nuevo usuario
//      * @param {Object} req - Request object
//      * @param {Object} res - Response object
//      */
//     static async createUser(req, res) {
//         try {
//             console.log('Starting createUser with data:', { ...req.body, password: '[REDACTED]' });
            
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 console.log('Validation errors:', errors.array());
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Error de validación',
//                     errors: errors.array()
//                 });
//             }

//             const {
//                 email,
//                 password,
//                 confirmPassword,
//                 name,
//                 lastname,
//                 dni,
//                 phone_number,
//                 id_role,
//                 id_module,
//                 observations,
//                 id_company,
//                 phone,
//                 position
//             } = req.body;

//             console.log('Validating passwords match...');
//             // Verificar si las contraseñas coinciden
//             if (password !== confirmPassword) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Las contraseñas no coinciden'
//                 });
//             }

//             console.log('Checking if email exists...');
//             // Verificar si el email ya existe
//             const existingUser = await User.searchUser(email);
//             if (existingUser) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'El email ya está registrado'
//                 });
//             }

//             console.log('Validating role...');
//             // Verificar si el rol existe
//             const [roles] = await pool.query('SELECT * FROM role WHERE id_role = ?', [id_role]);
//             if (!roles.length) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Rol no válido'
//                 });
//             }
//             const role = roles[0];
//             console.log('Role found:', role);

//             console.log('Hashing password...');
//             // Hashear la contraseña
//             //const hashedPassword = await bcrypt.hash(password, 10);

//             const rawPassword = dni?.toString();
//             if (!rawPassword) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'DNI es requerido para generar contraseña'
//                 });
//             }

//             const hashedPassword = await bcrypt.hash(rawPassword, 10);

//             console.log('Creating user...');
//             // Crear el usuario con todos sus datos
//             const userId = await User.createUser({
//                 email,
//                 password: hashedPassword,
//                 id_role,
//                 name,
//                 lastname,
//                 dni,
//                 phone_number,
//                 id_module,
//                 observations,
//                 id_company,
//                 position,
//                 phone
//             });

//             console.log('User created successfully with ID:', userId);
//             res.status(201).json({
//                 success: true,
//                 message: 'Usuario creado exitosamente',
//                 data: { id_user: userId }
//             });
//         } catch (error) {
//             console.error('Error in createUser:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Error al crear usuario',
//                 error: error.message
//             });
//         }
//     }

//     /**
//      * Actualiza un usuario existente
//      * @param {Object} req - Request object
//      * @param {Object} res - Response object
//      */
//     static async updateUser(req, res) {
//         try {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Error de validación',
//                     errors: errors.array()
//                 });
//             }

//             const { id_user } = req.params;
//             const updateData = { ...req.body };

//             // Si se está actualizando la contraseña, hashearla
//             if (updateData.password) {
//                 updateData.password = await bcrypt.hash(updateData.password, 10);
//             }

//             const success = await User.updateUser(id_user, updateData);

//             if (!success) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Usuario no encontrado'
//                 });
//             }

//             res.status(200).json({
//                 success: true,
//                 message: 'Usuario actualizado exitosamente'
//             });
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: 'Error al actualizar usuario',
//                 error: error.message
//             });
//         }
//     }

//     /**
//      * Elimina un usuario (soft delete)
//      * @param {Object} req - Request object
//      * @param {Object} res - Response object
//      */
//     static async deleteUser(req, res) {
//         try {
//             const { id_user } = req.params;

//             // Realizar soft delete
//             const success = await User.updateUser(id_user, {
//                 is_active: false,
//                 is_deleted: true,
//                 deleted_at: new Date()
//             });

//             if (!success) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Usuario no encontrado'
//                 });
//             }

//             // Cerrar todas las sesiones activas del usuario
//             const sessions = await User.getActiveSessions(id_user);
//             for (const session of sessions) {
//                 await User.logout(session.id_session);
//             }

//             res.status(200).json({
//                 success: true,
//                 message: 'Usuario eliminado exitosamente'
//             });
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: 'Error al eliminar usuario',
//                 error: error.message
//             });
//         }
//     }

//     /**
//      * Obtiene todos los usuarios
//      * @param {Object} req - Request object
//      * @param {Object} res - Response object
//      */
//     static async getAllUsers(req, res) {
//         try {
//             const users = await User.getAllUsers();

//             // Remover contraseñas de la respuesta
//             const usersWithoutPasswords = users.map(user => {
//                 const { password, ...userWithoutPassword } = user;
//                 return userWithoutPassword;
//             });

//             res.status(200).json({
//                 success: true,
//                 data: usersWithoutPasswords
//             });
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: 'Error al obtener usuarios',
//                 error: error.message
//             });
//         }
//     }


//         /**
//      * Obtiene a los profesores cargados en el sistema
//      */
//     static async getAllTeachers(req, res) {
//         try {
//             const teachers = await User.getTeachers();
//             // Verify that teachers is an array
//             if (!Array.isArray(teachers)) {
//                 throw new Error('La respuesta de la base de datos no es un array de profesores');
//             }

//             const teachersWithoutPassword = teachers.map(teacher => {
//                 const { password, ...teacherWithoutPassword } = teacher;
//                 return teacherWithoutPassword;
//             });

//             res.status(200).json({
//                 success: true,
//                 data: teachersWithoutPassword  // Fixed variable name
//             });
//         } catch (error) {
//             console.error('Error en getAllTeachers:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Error al obtener profesores',
//                 error: error.message
//             });
//         }
//     }

//     /**
//      * Obtiene un usuario por ID
//      * @param {Object} req - Request object
//      * @param {Object} res - Response object
//      */
//     static async getUserById(req, res) {
//         try {
//             const { id_user } = req.params;
//             const user = await User.getUserById(id_user);

//             if (!user) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Usuario no encontrado'
//                 });
//             }

//             // Remover contraseña de la respuesta
//             const { password, ...userWithoutPassword } = user;

//             res.status(200).json({
//                 success: true,
//                 data: userWithoutPassword
//             });
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: 'Error al obtener usuario',
//                 error: error.message
//             });
//         }
//     }

//     /**
//      * Obtiene todos los roles disponibles
//      * @param {Object} req - Request object
//      * @param {Object} res - Response object
//      */
//     static async getAllRoles(req, res) {
//         try {
//             const roles = await User.getAllRoles();
//             res.status(200).json({
//                 success: true,
//                 data: roles
//             });
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: 'Error al obtener roles',
//                 error: error.message
//             });
//         }
//     }

//     /**
//      * Obtiene todos los módulos disponibles
//      * @param {Object} req - Request object
//      * @param {Object} res - Response object
//      */
//     static async getAllModules(req, res) {
//         try {
//             const modules = await User.getAllModules();
//             res.status(200).json({
//                 success: true,
//                 data: modules
//             });
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: 'Error al obtener módulos',
//                 error: error.message
//             });
//         }
//     }

//     /**
//      * Obtiene estadísticas de usuarios
//      * @param {Object} req - Request object
//      * @param {Object} res - Response object
//      */
//     static async getUserStats(req, res) {
//         try {
//             console.log('Fetching user statistics...');
//             const stats = await User.getUserStats();
//             console.log('Statistics retrieved:', stats);
//             res.status(200).json({
//                 success: true,
//                 data: stats
//             });
//         } catch (error) {
//             console.error('Error detallado al obtener estadísticas:', {
//                 message: error.message,
//                 stack: error.stack,
//                 sqlMessage: error.sqlMessage,
//                 sqlState: error.sqlState,
//                 sqlCode: error.code
//             });
//             res.status(500).json({
//                 success: false,
//                 message: 'Error al cargar estadísticas',
//                 error: error.message,
//                 details: process.env.NODE_ENV === 'development' ? {
//                     sqlMessage: error.sqlMessage,
//                     sqlState: error.sqlState,
//                     sqlCode: error.code
//                 } : undefined
//             });
//         }
//     }
// }

export default UserController;