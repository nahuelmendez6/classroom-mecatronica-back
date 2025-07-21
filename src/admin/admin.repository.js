import Admin from "./admin.model.js";

class AdminRepository {
  // Obtener todos los administradores (que no están eliminados)
  async findAll() {
    return await Admin.findAll({
      where: { is_deleted: false }
    });
  }

  // Obtener un administrador por ID
  async findById(id) {
    return await Admin.findOne({
      where: {
        id_admin: id,
        is_deleted: false
      }
    });
  }

  // Crear un nuevo administrador
  async create(adminData) {
    return await Admin.create(adminData);
  }

  // Actualizar datos de un administrador
  async update(id, updatedData) {
    const admin = await this.findById(id);
    if (!admin) return null;

    await admin.update(updatedData);
    return admin;
  }

  // Soft delete de un administrador
  async delete(id) {
    const admin = await this.findById(id);
    if (!admin) return false;

    await admin.update({
      is_deleted: true,
      deleted_at: new Date()
    });

    return true;
  }

  // Restaurar un administrador eliminado
  async restore(id) {
    const admin = await Admin.findOne({
      where: {
        id_admin: id,
        is_deleted: true
      }
    });

    if (!admin) return null;

    await admin.update({
      is_deleted: false,
      deleted_at: null
    });

    return admin;
  }

  // Buscar por ID de usuario
  async findByUserId(userId) {
    return await Admin.findOne({
      where: {
        id_user: userId,
        is_deleted: false
      }
    });
  }
}

export default new AdminRepository();
