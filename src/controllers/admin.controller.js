import Admin from '../models/admin.model.js';
import { validationResult } from 'express-validator';

/**
 * Controlador que maneja todas las operaciones relacionadas con administradores
 */
class AdminController {
    /**
     * Crea un nuevo administrador
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async create(req, res) {
        try {
            // Validar los datos de entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: errors.array()
                });
            }

            const admin = await Admin.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Admin created successfully',
                data: admin
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating admin',
                error: error.message
            });
        }
    }

    /**
     * Realiza un soft-delete de un administrador
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await Admin.delete(id);
            res.json({
                success: true,
                message: 'Admin deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting admin',
                error: error.message
            });
        }
    }

    /**
     * Obtiene todos los administradores activos
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async getAll(req, res) {
        try {
            const admins = await Admin.getAll();
            res.json({
                success: true,
                data: admins
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error getting admins',
                error: error.message
            });
        }
    }

    /**
     * Obtiene un administrador por su ID
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const admin = await Admin.getById(id);
            
            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            res.json({
                success: true,
                data: admin
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error getting admin',
                error: error.message
            });
        }
    }

    /**
     * Restaura un administrador eliminado
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async restore(req, res) {
        try {
            const { id } = req.params;
            await Admin.restore(id);
            res.json({
                success: true,
                message: 'Admin restored successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error restoring admin',
                error: error.message
            });
        }
    }
}

export default AdminController; 