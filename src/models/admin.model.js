import db from '../../config/database.js';
import bcrypt from 'bcryptjs';

/**
 * Clase que maneja todas las operaciones relacionadas con administradores en la base de datos
 */
class Admin {
    /**
     * Crea un nuevo administrador en el sistema
     * @param {Object} adminData - Datos del administrador
     * @param {string} adminData.email - Email del administrador
     * @param {string} adminData.password - Contraseña del administrador
     * @param {string} adminData.name - Nombre del administrador
     * @param {string} adminData.lastname - Apellido del administrador
     * @returns {Object} Datos del administrador creado
     */
    static async create(adminData) {
        try {
            const { email, password, name, lastname } = adminData;
            
            // Iniciamos una transacción para asegurar la integridad de los datos
            const connection = await db.getConnection();
            await connection.beginTransaction();

            try {
                // Encriptamos la contraseña antes de guardarla
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Primero creamos el usuario en la tabla user
                const [userResult] = await connection.execute(
                    'INSERT INTO user (email, password, id_role) VALUES (?, ?, 1)',
                    [email, hashedPassword]
                );

                const userId = userResult.insertId;

                // Luego creamos el registro en la tabla admin
                const [adminResult] = await connection.execute(
                    'INSERT INTO admin (id_user, name, lastname) VALUES (?, ?, ?)',
                    [userId, name, lastname]
                );

                // Si todo sale bien, confirmamos la transacción
                await connection.commit();
                return { id: adminResult.insertId, userId, name, lastname, email };
            } catch (error) {
                // Si algo sale mal, revertimos la transacción
                await connection.rollback();
                throw error;
            } finally {
                // Liberamos la conexión
                connection.release();
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Elimina un administrador del sistema
     * @param {number} adminId - ID del administrador a eliminar
     * @returns {boolean} true si se eliminó correctamente
     */
    static async delete(adminId) {
        try {
            const connection = await db.getConnection();
            await connection.beginTransaction();

            try {
                // Obtenemos el ID del usuario asociado al administrador
                const [admin] = await connection.execute(
                    'SELECT id_user FROM admin WHERE id_admin = ?',
                    [adminId]
                );

                if (admin.length === 0) {
                    throw new Error('Admin not found');
                }

                const userId = admin[0].id_user;

                // Eliminamos el registro de la tabla admin
                await connection.execute(
                    'DELETE FROM admin WHERE id_admin = ?',
                    [adminId]
                );

                // Eliminamos el registro de la tabla user
                await connection.execute(
                    'DELETE FROM user WHERE id_user = ?',
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
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene todos los administradores del sistema
     * @returns {Array} Lista de administradores
     */
    static async getAll() {
        try {
            const [admins] = await db.execute(`
                SELECT a.id_admin, a.name, a.lastname, u.email, u.is_active, u.created_at
                FROM admin a
                JOIN user u ON a.id_user = u.id_user
                ORDER BY a.id_admin DESC
            `);
            return admins;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene un administrador específico por su ID
     * @param {number} adminId - ID del administrador a buscar
     * @returns {Object|null} Datos del administrador o null si no existe
     */
    static async getById(adminId) {
        try {
            const [admins] = await db.execute(`
                SELECT a.id_admin, a.name, a.lastname, u.email, u.is_active, u.created_at
                FROM admin a
                JOIN user u ON a.id_user = u.id_user
                WHERE a.id_admin = ?
            `, [adminId]);
            
            return admins[0] || null;
        } catch (error) {
            throw error;
        }
    }
}

export default Admin; 