import Admin from '../models/admin.model.js';
import { validationResult } from 'express-validator';

class AdminController {
    static async create(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const admin = await Admin.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Admin created successfully',
                data: admin
            });
        } catch (error) {
            console.error('Error creating admin:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating admin',
                error: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await Admin.delete(id);
            res.json({
                success: true,
                message: 'Admin deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting admin:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting admin',
                error: error.message
            });
        }
    }

    static async getAll(req, res) {
        try {
            const admins = await Admin.getAll();
            res.json({
                success: true,
                data: admins
            });
        } catch (error) {
            console.error('Error getting admins:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting admins',
                error: error.message
            });
        }
    }

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
            console.error('Error getting admin:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting admin',
                error: error.message
            });
        }
    }
}

export default AdminController; 