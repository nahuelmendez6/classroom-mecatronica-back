import { pool } from '../../config/database.js';
import bcrypt from 'bcryptjs';
import Session from './session.model.js';

/**
 * Clase que maneja las operaciones de base de datos relacionadas con los usuarios
 */
class User {
    /**
     * Crea un nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @param {string} userData.email - Email del usuario
     * @param {string} userData.password - Contraseña del usuario
     * @param {string} userData.name - Nombre del usuario
     * @param {string} userData.lastname - Apellido del usuario
     * @returns {Promise<Object>} Datos del usuario creado
     */


    static async searchUser(email) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
            return rows[0];
        } finally {
            connection.release();
        }
    }


    static async authUser(email, password)  {
        const user = await this.searchUser(email);
        if (!user) {
            throw new Error('Usurio no encontrado');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Contaseña incorrecta');
        }
        return user;
    }


    static async getUserById(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM user WHERE id = ?', [id]);
            return rows[0];
        } finally { 
            connection.release();
        }
    }

    static async updateUser(id, userData) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query('UPDATE user SET ? WHERE id = ?', [userData, id]);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }   

    static async deleteUser(id) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query('DELETE FROM user WHERE id = ?', [id]);
            return result.affectedRows > 0; 
        } finally {
            connection.release();
        }
    }

    static async getAllUsers() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`
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
            `);
            return rows;
        } finally {
            connection.release();
        }       
    }

    static async createUser(userData) {
        const connection = await pool.getConnection();
        try {
            console.log('Starting createUser in model with data:', { ...userData, password: '[REDACTED]' });
            await connection.beginTransaction();

            // 1. Get role name from id_role
            console.log('Getting role name for id_role:', userData.id_role);
            const [roleResult] = await connection.query('SELECT name FROM role WHERE id_role = ?', [userData.id_role]);
            if (!roleResult.length) {
                console.error('Role not found for id_role:', userData.id_role);
                throw new Error('Rol no válido');
            }
            const roleName = roleResult[0].name.toLowerCase().replace(' ', '_');
            console.log('Role name found:', roleName);

            // 2. Crear el usuario base
            console.log('Creating base user...');
            const [userResult] = await connection.query('INSERT INTO user SET ?', [{
                email: userData.email,
                password: userData.password,
                id_role: userData.id_role,
                is_active: true
            }]);
            const userId = userResult.insertId;
            console.log('Base user created with ID:', userId);

            // 3. Crear el registro específico según el rol
            console.log('Creating role-specific record for role:', roleName);
            switch (roleName) {
                case 'estudiante':
                    console.log('Creating student record...');
                    await connection.query('INSERT INTO student SET ?', [{
                        id_user: userId,
                        name: userData.name,
                        lastname: userData.lastname,
                        dni: userData.dni,
                        phone_number: userData.phone_number,
                        observations: userData.observations
                    }]);
                    break;
                case 'profesor':
                    console.log('Creating teacher record...');
                    await connection.query('INSERT INTO teacher SET ?', [{
                        id_user: userId,
                        name: userData.name,
                        lastname: userData.lastname,
                        phone_number: userData.phone_number,
                        observations: userData.observations
                    }]);
                    break;
                case 'administrador':
                    console.log('Creating admin record...');
                    await connection.query('INSERT INTO admin SET ?', [{
                        id_user: userId,
                        name: userData.name,
                        lastname: userData.lastname
                    }]);
                    break;
                default:
                    console.error('Invalid role name:', roleName);
                    throw new Error('Rol no válido');
            }

            // 4. Si es estudiante y tiene módulo asignado, crear la relación
            if (roleName === 'estudiante' && userData.id_module) {
                console.log('Creating student-module relationship...');
                await connection.query('INSERT INTO student_module SET ?', [{
                    id_student: userId,
                    id_module: userData.id_module,
                    status: 'Asignado'
                }]);
            }

            console.log('Committing transaction...');
            await connection.commit();
            console.log('Transaction committed successfully');
            return userId;
        } catch (error) {
            console.error('Error in createUser model:', error);
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Método para obtener todos los roles disponibles
    static async getAllRoles() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM role');
            return rows;
        } finally {
            connection.release();
        }
    }

    // Método para obtener todos los módulos disponibles
    static async getAllModules() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM module WHERE is_active = 1');
            return rows;
        } finally {
            connection.release();
        }
    }

    static async updateLastLogin(id) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query('UPDATE user SET last_login = NOW() WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    /**
     * Autentica un usuario y registra la sesión
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @param {Object} sessionInfo - Información de la sesión
     * @param {string} sessionInfo.ip_address - IP del usuario
     * @param {string} sessionInfo.user_agent - User agent del navegador
     * @returns {Promise<Object>} Datos del usuario y la sesión
     */
    static async authenticateAndCreateSession(email, password, sessionInfo) {
        const connection = await pool.getConnection();
        try {
            // Buscar usuario
            const [users] = await connection.query(
                'SELECT * FROM user WHERE email = ? AND is_active = 1',
                [email]
            );
            const user = users[0];

            // Registrar intento de login
            await Session.recordLoginAttempt({
                email,
                ip_address: sessionInfo.ip_address,
                user_agent: sessionInfo.user_agent,
                status: user ? 'success' : 'failed',
                failure_reason: user ? null : 'Usuario no encontrado',
                id_user: user?.id_user
            });

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            // Verificar contraseña
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

            // Verificar sesiones activas
            if (await Session.hasTooManyActiveSessions(user.id_user)) {
                throw new Error('Demasiadas sesiones activas');
            }

            // Crear nueva sesión
            const sessionId = await Session.createSession({
                id_user: user.id_user,
                ip_address: sessionInfo.ip_address,
                user_agent: sessionInfo.user_agent
            });

            // Obtener rol del usuario
            const [roles] = await connection.query(
                'SELECT r.* FROM role r WHERE r.id_role = ?',
                [user.id_role]
            );

            return {
                user: {
                    id_user: user.id_user,
                    email: user.email,
                    role: roles[0]
                },
                sessionId
            };
        } finally {
            connection.release();
        }
    }

    /**
     * Cierra la sesión de un usuario
     * @param {number} sessionId - ID de la sesión a cerrar
     * @returns {Promise<boolean>} true si la sesión se cerró correctamente
     */
    static async logout(sessionId) {
        return await Session.closeSession(sessionId);
    }

    /**
     * Obtiene las sesiones activas de un usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} Lista de sesiones activas
     */
    static async getActiveSessions(userId) {
        return await Session.getActiveSessions(userId);
    }

    /**
     * Obtiene estadísticas de usuarios
     * @returns {Promise<Object>} Estadísticas de usuarios
     */
    static async getUserStats() {
        const connection = await pool.getConnection();
        try {
            console.log('Executing getUserStats query...');
            // Primero verificar si la tabla role tiene los roles esperados
            const [roles] = await connection.query('SELECT DISTINCT name FROM role');
            console.log('Available roles:', roles.map(r => r.name));

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
            
            console.log('Executing query:', query);
            const [rows] = await connection.query(query);
            console.log('Query result:', rows[0]);

            // Asegurarnos de que todos los campos sean números
            const stats = {
                totalUsers: parseInt(rows[0].totalUsers) || 0,
                totalStudents: parseInt(rows[0].totalStudents) || 0,
                totalTeachers: parseInt(rows[0].totalTeachers) || 0,
                totalTutors: parseInt(rows[0].totalTutors) || 0,
                totalAdmins: parseInt(rows[0].totalAdmins) || 0
            };

            console.log('Processed stats:', stats);
            return stats;
        } catch (error) {
            console.error('Error in getUserStats model:', {
                message: error.message,
                sqlMessage: error.sqlMessage,
                sqlState: error.sqlState,
                sqlCode: error.code,
                stack: error.stack
            });
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default User;
