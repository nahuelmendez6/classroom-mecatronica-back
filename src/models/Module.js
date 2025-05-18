import { pool } from '../config/database.js';

class Module {
  static async getAll() {
    try {
      const [modules] = await pool.query(`
        SELECT 
          m.id_module as id,
          m.name as nombre,
          m.description as descripcion,
          m.duration as duracion,
          m.icon_url as icono,
          c.course as curso,
          GROUP_CONCAT(DISTINCT CONCAT(t.name, ' ', t.lastname)) as profesores,
          COUNT(DISTINCT sm.id_student) as total_alumnos,
          COUNT(DISTINCT lm.id_material) as total_materiales
        FROM module m
        LEFT JOIN course c ON m.id_course = c.id_course
        LEFT JOIN module_teacher mt ON m.id_module = mt.id_module
        LEFT JOIN teacher t ON mt.id_teacher = t.id_teacher
        LEFT JOIN student_module sm ON m.id_module = sm.id_module
        LEFT JOIN learning_material lm ON m.id_module = lm.id_module
        GROUP BY m.id_module
        ORDER BY m.name
      `);

      return modules.map(module => ({
        ...module,
        profesores: module.profesores ? module.profesores.split(',') : [],
        submodulos: [] // Por ahora vacío, se puede implementar si se necesita
      }));
    } catch (error) {
      throw new Error('Error al obtener los módulos: ' + error.message);
    }
  }

  static async create(moduleData) {
    const { nombre, descripcion, icono, id_profesor, duracion, id_course } = moduleData;
    
    console.log('Creating module with data:', moduleData);
    console.log('id_profesor value:', id_profesor, 'type:', typeof id_profesor);
    
    try {
      await pool.query('START TRANSACTION');

      // Insertar módulo
      const [result] = await pool.query(
        'INSERT INTO module (name, description, icon_url, duration, id_course) VALUES (?, ?, ?, ?, ?)',
        [nombre, descripcion, icono, duracion, id_course]
      );

      const id_module = result.insertId;
      console.log('Module created with ID:', id_module);

      // Asignar profesor si se proporcionó
      
      if (id_profesor) {
        console.log('Attempting to assign teacher:', id_profesor, 'to module:', id_module);
        try {
          const [teacherResult] = await pool.query(
            'INSERT INTO module_teacher (id_module, id_teacher) VALUES (?, ?)',
            [id_module, id_profesor]
          );
          console.log('Teacher assignment result:', teacherResult);
        } catch (teacherError) {
          console.error('Error assigning teacher:', teacherError);
          throw new Error(`Error al asignar profesor: ${teacherError.message}`);
        }
      } else {
        console.log('No teacher ID provided, skipping teacher assignment');
      }

      await pool.query('COMMIT');
      console.log('Transaction committed successfully');
      return { id: id_module };
    } catch (error) {
      console.error('Error in module creation:', error);
      await pool.query('ROLLBACK');
      throw new Error('Error al crear el módulo: ' + error.message);
    }
  } 

  static async delete(id) {
    try {
      await pool.query('START TRANSACTION');

      // Eliminar relaciones primero
      await pool.query('DELETE FROM module_teacher WHERE id_module = ?', [id]);
      await pool.query('DELETE FROM student_module WHERE id_module = ?', [id]);
      await pool.query('DELETE FROM learning_material WHERE id_module = ?', [id]);

      // Eliminar módulo
      await pool.query('DELETE FROM module WHERE id_module = ?', [id]);

      await pool.query('COMMIT');
      return true;
    } catch (error) {
      await pool.query('ROLLBACK');
      throw new Error('Error al eliminar el módulo: ' + error.message);
    }
  }

  static async getStats() {
    try {
      const [stats] = await pool.query(`
        SELECT 
          COUNT(DISTINCT m.id_module) as totalModulos,
          COUNT(DISTINCT lm.id_material) as totalSubmodulos,
          COUNT(DISTINCT sm.id_student) as alumnosActivos,
          COUNT(DISTINCT mt.id_teacher) as profesoresAsignados
        FROM module m
        LEFT JOIN learning_material lm ON m.id_module = lm.id_module
        LEFT JOIN student_module sm ON m.id_module = sm.id_module AND sm.status = 'En Progreso'
        LEFT JOIN module_teacher mt ON m.id_module = mt.id_module
      `);

      return stats[0];
    } catch (error) {
      throw new Error('Error al obtener estadísticas: ' + error.message);
    }
  }
}

export default Module; 