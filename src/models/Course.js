import { pool } from '../config/database.js';

class Course {
  static async getAll() {
    try {
      const [courses] = await pool.query(`
        SELECT 
          c.*,
          COUNT(DISTINCT m.id_module) as total_modules,
          COUNT(DISTINCT sm.id_student) as total_students,
          COUNT(DISTINCT mt.id_teacher) as total_teachers
        FROM course c
        LEFT JOIN module m ON c.id_course = m.id_course
        LEFT JOIN student_module sm ON m.id_module = sm.id_module
        LEFT JOIN module_teacher mt ON m.id_module = mt.id_module
        GROUP BY c.id_course
        ORDER BY c.start_date DESC
      `);
      return courses;
    } catch (error) {
      throw new Error('Error al obtener los cursos: ' + error.message);
    }
  }

  static async getById(id) {
    try {
      const [courses] = await pool.query(`
        SELECT 
          c.*,
          COUNT(DISTINCT m.id_module) as total_modules,
          COUNT(DISTINCT sm.id_student) as total_students,
          COUNT(DISTINCT mt.id_teacher) as total_teachers
        FROM course c
        LEFT JOIN module m ON c.id_course = m.id_course
        LEFT JOIN student_module sm ON m.id_module = sm.id_module
        LEFT JOIN module_teacher mt ON m.id_module = mt.id_module
        WHERE c.id_course = ?
        GROUP BY c.id_course
      `, [id]);
      return courses[0];
    } catch (error) {
      throw new Error('Error al obtener el curso: ' + error.message);
    }
  }

  static async create(courseData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        'INSERT INTO course (course, start_date, end_date, status, description) VALUES (?, ?, ?, ?, ?)',
        [courseData.course, courseData.start_date, courseData.end_date, courseData.status, courseData.description]
      );

      await connection.commit();
      return { id_course: result.insertId, ...courseData };
    } catch (error) {
      await connection.rollback();
      throw new Error('Error al crear el curso: ' + error.message);
    } finally {
      connection.release();
    }
  }

  static async update(id, courseData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        'UPDATE course SET course = ?, start_date = ?, end_date = ?, status = ?, description = ? WHERE id_course = ?',
        [courseData.course, courseData.start_date, courseData.end_date, courseData.status, courseData.description, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Curso no encontrado');
      }

      await connection.commit();
      return { id_course: id, ...courseData };
    } catch (error) {
      await connection.rollback();
      throw new Error('Error al actualizar el curso: ' + error.message);
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Verificar si hay módulos asociados
      const [modules] = await connection.query(
        'SELECT COUNT(*) as count FROM module WHERE id_course = ?',
        [id]
      );

      if (modules[0].count > 0) {
        throw new Error('No se puede eliminar el curso porque tiene módulos asociados');
      }

      const [result] = await connection.query(
        'DELETE FROM course WHERE id_course = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Curso no encontrado');
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw new Error('Error al eliminar el curso: ' + error.message);
    } finally {
      connection.release();
    }
  }


  


}

export default Course; 