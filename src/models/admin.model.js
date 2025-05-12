import { pool } from '../../config/database.js';
import bcrypt from 'bcryptjs';

/**
 * Clase que maneja las operaciones de base de datos relacionadas con los administradores
 */
class Admin {
    /**
     * Crea un nuevo administrador
     * @param {Object} adminData - Datos del administrador
     * @param {string} adminData.email - Email del administrador
     * @param {string} adminData.password - Contraseña del administrador
     * @param {string} adminData.name - Nombre del administrador
     * @param {string} adminData.lastname - Apellido del administrador
     * @returns {Promise<Object>} Datos del administrador creado
     */
    static async create(adminData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Hashear la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminData.password, salt);

            // Insertar en la tabla user
            const [userResult] = await connection.query(
                'INSERT INTO user (email, password, name, lastname, id_role) VALUES (?, ?, ?, ?, 1)',
                [adminData.email, hashedPassword, adminData.name, adminData.lastname]
            );

            // Insertar en la tabla admin
            const [adminResult] = await connection.query(
                'INSERT INTO admin (id_user) VALUES (?)',
                [userResult.insertId]
            );

            await connection.commit();

            return {
                id: adminResult.insertId,
                ...adminData,
                password: undefined // No devolver la contraseña
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Realiza un soft-delete de un administrador
     * @param {number} id - ID del administrador a eliminar
     * @returns {Promise<boolean>} true si se eliminó correctamente
     */
    static async delete(id) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Obtener el id_user asociado al admin
            const [adminResult] = await connection.query(
                'SELECT id_user FROM admin WHERE id_admin = ? AND is_deleted = FALSE',
                [id]
            );

            if (adminResult.length === 0) {
                throw new Error('Admin not found');
            }

            const userId = adminResult[0].id_user;

            // Realizar soft-delete en la tabla admin
            await connection.query(
                'UPDATE admin SET is_deleted = TRUE, deleted_at = NOW() WHERE id_admin = ?',
                [id]
            );

            // Realizar soft-delete en la tabla user
            await connection.query(
                'UPDATE user SET is_deleted = TRUE, deleted_at = NOW() WHERE id_user = ?',
                [userId]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Obtiene todos los administradores activos
     * @returns {Promise<Array>} Lista de administradores
     */
    static async getAll() {
        const [rows] = await pool.query(`
            SELECT a.id_admin, u.email, u.name, u.lastname, u.created_at
            FROM admin a
            JOIN user u ON a.id_user = u.id_user
            WHERE a.is_deleted = FALSE AND u.is_deleted = FALSE
        `);
        return rows;
    }

    /**
     * Obtiene un administrador por su ID
     * @param {number} id - ID del administrador
     * @returns {Promise<Object>} Datos del administrador
     */
    static async getById(id) {
        const [rows] = await pool.query(`
            SELECT a.id_admin, u.email, u.name, u.lastname, u.created_at
            FROM admin a
            JOIN user u ON a.id_user = u.id_user
            WHERE a.id_admin = ? AND a.is_deleted = FALSE AND u.is_deleted = FALSE
        `, [id]);
        return rows[0];
    }

    /**
     * Restaura un administrador eliminado
     * @param {number} id - ID del administrador a restaurar
     * @returns {Promise<boolean>} true si se restauró correctamente
     */
    static async restore(id) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Obtener el id_user asociado al admin
            const [adminResult] = await connection.query(
                'SELECT id_user FROM admin WHERE id_admin = ? AND is_deleted = TRUE',
                [id]
            );

            if (adminResult.length === 0) {
                throw new Error('Admin not found or not deleted');
            }

            const userId = adminResult[0].id_user;

            // Restaurar en la tabla admin
            await connection.query(
                'UPDATE admin SET is_deleted = FALSE, deleted_at = NULL WHERE id_admin = ?',
                [id]
            );

            // Restaurar en la tabla user
            await connection.query(
                'UPDATE user SET is_deleted = FALSE, deleted_at = NULL WHERE id_user = ?',
                [userId]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default Admin; 