import { pool } from "../../config/database.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";

/**
 * Clase que maneja las operaciones de base de datos relacionadas con los profesores
 */
class Teacher {


    static async create(teacherData) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(teacherData.password, salt);

            const [userResult] = await connection.query(
                'INSERT INTO user (email, password, name, lastname, id_role) VALUES (?, ?, ?, ?, 2)',
                [teacherData.email, hashedPassword, teacherData.name, teacherData.lastname]
            )

            const [teacherResult] = await connection.query(
                'INSERT INTO teacher (id_user) VALUES (?)',
                [userResult.insertId]
            )

            await connection.commit();

            return {
                id: userResult.insertId,
                ...teacherData,
                password: undefined // No devolver la contraseña
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    }

}

export default Teacher;