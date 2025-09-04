import AdminRepository from './admin.repository.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

import { createAdminWithUser } from './admin.service.js';

import { validationResult } from 'express-validator';
import {asyncHandler} from '../utils/errorHandler.js';

import { sendValidationError } from '../utils/responseHandler.js';

class AdminController {
  // Obtener todos los administradores activos
  static async getAll(req, res) {
    try {
      const admins = await AdminRepository.findAll();
      sendSuccess(res, 200, 'Administradores obtenidos correctamente', admins);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Obtener un administrador por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const admin = await AdminRepository.findById(id);

      if (!admin) return sendError(res, 404, 'Administrador no encontrado');
      sendSuccess(res, 200, 'Administrador obtenido correctamente', admin);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  
    static createWithUser = asyncHandler(async (req, res) => {
  
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
              return sendValidationError(res, errors.array());
          }
  
          const admin = await createAdminWithUser(req.body);
          sendSuccess(res, 201, 'Admin created successfully with user', admin);
  
      })
  
  
  
  
  // Crear un nuevo administrador
  static async create(req, res) {
    try {
      const adminData = req.body;
      const newAdmin = await AdminRepository.create(adminData);
      sendSuccess(res, 201, 'Administrador creado correctamente', newAdmin);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Actualizar un administrador
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedAdmin = await AdminRepository.update(id, updateData);
      if (!updatedAdmin) return sendError(res, 404, 'Administrador no encontrado');

      sendSuccess(res, 200, 'Administrador actualizado correctamente', updatedAdmin);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Eliminar (soft delete) un administrador
  static async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await AdminRepository.delete(id);

      if (!deleted) return sendError(res, 404, 'Administrador no encontrado');
      sendSuccess(res, 200, 'Administrador eliminado correctamente');
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Restaurar un administrador eliminado
  static async restore(req, res) {
    try {
      const { id } = req.params;
      const restoredAdmin = await AdminRepository.restore(id);

      if (!restoredAdmin) return sendError(res, 404, 'Administrador no encontrado o no eliminado');
      sendSuccess(res, 200, 'Administrador restaurado correctamente', restoredAdmin);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  // Buscar administrador por ID de usuario
  static async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      const admin = await AdminRepository.findByUserId(userId);

      if (!admin) return sendError(res, 404, 'Administrador no encontrado');
      sendSuccess(res, 200, 'Administrador obtenido correctamente', admin);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }
}

export default AdminController;
