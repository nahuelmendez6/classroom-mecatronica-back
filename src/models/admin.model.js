const db = require('../../config/database');
const bcrypt = require('bcryptjs');

class Admin {
    static async create(adminData) {
        try {
            const { email, password, name, lastname } = adminData;
            
            // Start transaction
            const connection = await db.getConnection();
            await connection.beginTransaction();

            try {
                // Hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Insert into user table
                const [userResult] = await connection.execute(
                    'INSERT INTO user (email, password, id_role) VALUES (?, ?, 1)',
                    [email, hashedPassword]
                );

                const userId = userResult.insertId;

                // Insert into admin table
                const [adminResult] = await connection.execute(
                    'INSERT INTO admin (id_user, name, lastname) VALUES (?, ?, ?)',
                    [userId, name, lastname]
                );

                await connection.commit();
                return { id: adminResult.insertId, userId, name, lastname, email };
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

    static async delete(adminId) {
        try {
            const connection = await db.getConnection();
            await connection.beginTransaction();

            try {
                // Get user_id from admin
                const [admin] = await connection.execute(
                    'SELECT id_user FROM admin WHERE id_admin = ?',
                    [adminId]
                );

                if (admin.length === 0) {
                    throw new Error('Admin not found');
                }

                const userId = admin[0].id_user;

                // Delete from admin table
                await connection.execute(
                    'DELETE FROM admin WHERE id_admin = ?',
                    [adminId]
                );

                // Delete from user table
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

module.exports = Admin; 