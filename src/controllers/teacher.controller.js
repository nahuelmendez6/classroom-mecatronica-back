import Teacher from '../models/teacher.model.js';
import { validationResult } from 'express-validator';

/**
 * Controlador que maneja todas las operaciones relacionadas con profesores
 */
class TeacherController {
    /**
     * Crea un nuevo profesor
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

            const teacher = await Teacher.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Teacher created successfully',
                data: teacher
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating teacher',
                error: error.message
            });
        }
    }

    /**
     * Realiza un soft-delete de un profesor
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await Teacher.delete(id);
            res.json({
                success: true,
                message: 'Teacher deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting teacher',
                error: error.message
            });
        }
    }

    /**
     * Obtiene todos los profesores activos
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async getAll(req, res) {
        try {
            const teachers = await Teacher.getAll();
            res.json({
                success: true,
                data: teachers
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error getting teachers',
                error: error.message
            });
        }
    }

    /**
     * Obtiene un profesor por su ID
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const teacher = await Teacher.getById(id);
            
            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: 'Teacher not found'
                });
            }

            res.json({
                success: true,
                data: teacher
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error getting teacher',
                error: error.message
            });
        }
    }

    /**
     * Restaura un profesor eliminado
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async restore(req, res) {
        try {
            const { id } = req.params;
            await Teacher.restore(id);
            res.json({
                success: true,
                message: 'Teacher restored successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error restoring teacher',
                error: error.message
            });
        }
    }
}

export default TeacherController; 