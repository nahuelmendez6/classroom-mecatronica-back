import SubModule from './sub.module.model.js';
import Module from './module.model.js'; // si tenés la relación definida

class SubModuleRepository {
  // Obtener todos los submódulos
  async findAll() {
    return await SubModule.findAll();
  }

  // Obtener un submódulo por ID
  async findById(id) {
    return await SubModule.findByPk(id);
  }

  // Crear un nuevo submódulo
  async create(subModuleData) {
    return await SubModule.create(subModuleData);
  }

  // Actualizar un submódulo por ID
  async update(id, updatedData) {
    const subModule = await SubModule.findByPk(id);
    if (!subModule) return null;

    await subModule.update(updatedData);
    return subModule;
  }

  // Eliminar un submódulo por ID
  async delete(id) {
    const deletedCount = await SubModule.destroy({
      where: { id_sub_module: id }
    });
    return deletedCount > 0;
  }

  // Obtener submódulos por módulo
  async findByModuleId(moduleId) {
    return await SubModule.findAll({
      where: { id_module: moduleId },
      order: [['order', 'ASC']]
    });
  }
}

export default new SubModuleRepository();
