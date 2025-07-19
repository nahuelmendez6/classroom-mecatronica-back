import ModuleRepository from './module.repository.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

class ModuleController {
  // Obtener todos los módulos (con detalles opcionales)
  static async getAll(req, res) {
    try {
      const { details } = req.query;
      const modules = details === 'true'
        ? await ModuleRepository.findAllWithDetails()
        : await ModuleRepository.findAll();

      sendSuccess(res, 200, 'Módulos obtenidos correctamente', modules);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Obtener un módulo por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const module = await ModuleRepository.findById(id);

      if (!module) return sendError(res, 404, 'Módulo no encontrado');
      sendSuccess(res, 200, 'Módulo obtenido correctamente', module);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Crear un nuevo módulo
  static async create(req, res) {
    try {
      const moduleData = req.body;
      const newModule = await ModuleRepository.create(moduleData);
      sendSuccess(res, 201, 'Módulo creado correctamente', newModule);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Actualizar un módulo existente
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updated = await ModuleRepository.update(id, updateData);

      if (!updated) return sendError(res, 404, 'Módulo no encontrado');
      sendSuccess(res, 200, 'Módulo actualizado correctamente', updated);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Eliminar un módulo
  static async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ModuleRepository.delete(id);

      if (!deleted) return sendError(res, 404, 'Módulo no encontrado');
      sendSuccess(res, 200, 'Módulo eliminado correctamente');
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Obtener estadísticas
  static async getStats(req, res) {
    try {
      const stats = await ModuleRepository.getStats();
      sendSuccess(res, 200, 'Estadísticas de módulos obtenidas correctamente', stats);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }
}

export default ModuleController;
