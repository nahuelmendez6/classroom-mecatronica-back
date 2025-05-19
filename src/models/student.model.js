import { pool } from '../../config/database.js';

class Student {
    static async create(studentData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `INSERT INTO student 
                    (id_user, name, lastname, dni, phone_number, id_course, observations, is_deleted, deleted_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, FALSE, NULL)`,
                [
                    studentData.id_user,
                    studentData.name,
                    studentData.lastname,
                    studentData.dni,
                    studentData.phone_number,
                    studentData.id_course,
                    studentData.observations || null
                ]
            );

            await connection.commit();
            return { id_student: result.insertId, ...studentData };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id) {
        const [result] = await pool.query(
            `UPDATE student 
             SET is_deleted = TRUE, deleted_at = NOW() 
             WHERE id_student = ? AND is_deleted = FALSE`,
            [id]
        );
        return result.affectedRows > 0;
    }

    static async restore(id) {
        const [result] = await pool.query(
            `UPDATE student 
             SET is_deleted = FALSE, deleted_at = NULL 
             WHERE id_student = ? AND is_deleted = TRUE`,
            [id]
        );
        return result.affectedRows > 0;
    }

    static async getAll() {
        const [rows] = await pool.query(
            `SELECT * FROM student 
             WHERE is_deleted = FALSE`
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.query(
            `SELECT * FROM student 
             WHERE id_student = ? AND is_deleted = FALSE`,
            [id]
        );
        return rows[0];
    }
}

export default Student;
