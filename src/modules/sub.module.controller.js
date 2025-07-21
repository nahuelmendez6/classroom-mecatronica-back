import SubModuleRepository from './sub.module.repository.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

class SubModuleController {
  // Obtener todos los submódulos
  static async getAll(req, res) {
    try {
      const submodules = await SubModuleRepository.findAll();
      sendSuccess(res, 200, 'Submódulos obtenidos correctamente', submodules);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Obtener un submódulo por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const submodule = await SubModuleRepository.findById(id);

      if (!submodule) return sendError(res, 404, 'Submódulo no encontrado');
      sendSuccess(res, 200, 'Submódulo obtenido correctamente', submodule);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Crear un nuevo submódulo
  static async create(req, res) {
    try {
      const subModuleData = req.body;
      const newSubModule = await SubModuleRepository.create(subModuleData);
      sendSuccess(res, 201, 'Submódulo creado correctamente', newSubModule);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Actualizar un submódulo existente
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updated = await SubModuleRepository.update(id, updateData);

      if (!updated) return sendError(res, 404, 'Submódulo no encontrado');
      sendSuccess(res, 200, 'Submódulo actualizado correctamente', updated);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Eliminar un submódulo
  static async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await SubModuleRepository.delete(id);

      if (!deleted) return sendError(res, 404, 'Submódulo no encontrado');
      sendSuccess(res, 200, 'Submódulo eliminado correctamente');
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Obtener submódulos por ID de módulo (filtrados)
  static async getByModuleId(req, res) {
    try {
      const { moduleId } = req.params;
      const submodules = await SubModuleRepository.findByModuleId(moduleId);

      if (!submodules || submodules.length === 0)
        return sendError(res, 404, 'No se encontraron submódulos para el módulo especificado');

      sendSuccess(res, 200, 'Submódulos obtenidos correctamente', submodules);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }
}

export default SubModuleController;
