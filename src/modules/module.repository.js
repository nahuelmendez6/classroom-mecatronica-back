import Module from './module.model.js';
import SubModule from './sub.module.model.js';
import sequelize from '../config/sequalize.js';
import { QueryTypes } from 'sequelize';

class ModuleRepository {
  // Obtener todos los módulos con sus relaciones
//   async findAllWithDetails() {
//     return await Module.findAll({
//       include: [
//         {
//           association: 'submodules' // Asegurate de definir los alias correctamente en las asociaciones
//         },
//         {
//           association: 'moduleTeachers',
//           include: [
//             {
//               association: 'teacher',
//               include: [
//                 {
//                   association: 'User'
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     });
//   }
    async findAllWithDetails() {
    return await Module.findAll({
      include: [
        {
          model: SubModule,
          as: 'submodules' // <- ¡Este alias debe coincidir con el definido en el `hasMany`!
        }
      ]
    });
  }

  // Obtener todos los módulos (sin relaciones)
  async findAll() {
    return await Module.findAll();
  }

  // Obtener módulo por ID
//   async findById(id_module) {
//     return await Module.findByPk(id_module);
//   }
  async findById(id) {
    return await Module.findByPk(id, {
      include: [
        {
          model: SubModule,
          as: 'submodules'
        }
      ]
    });
  }
  // Crear un módulo
  async create(moduleData) {
    return await Module.create(moduleData);
  }

  // Actualizar módulo
  async update(id_module, updateData) {
    const module = await Module.findByPk(id_module);
    if (!module) return null;
    return await module.update(updateData);
  }

  // Eliminar módulo
  async delete(id_module) {
    return await Module.destroy({
      where: { id_module }
    });
  }

  // Obtener estadísticas agregadas
  async getStats() {
    const query = `
      SELECT 
        COUNT(*) AS totalModules,
        (SELECT COUNT(*) FROM submodule) AS totalSubmodules,
        (SELECT COUNT(*) FROM student_module WHERE status IN ('Asignado', 'En Progreso')) AS activeStudents,
        (SELECT COUNT(DISTINCT id_teacher) FROM teacher_module) AS assignedTeachers
    `;

    const [result] = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });

    return {
      totalModules: parseInt(result.totalModules, 10),
      totalSubmodules: parseInt(result.totalSubmodules, 10),
      activeStudents: parseInt(result.activeStudents, 10),
      assignedTeachers: parseInt(result.assignedTeachers, 10),
    };
  }
}

export default new ModuleRepository();
