import Admin from '../models/admin.model.js';
import { AppError, NotFoundError } from '../utils/errorHandler.js';

class AdminService {
    static async createAdmin(adminData) {
        try {
            const admin = await Admin.create(adminData);
            return admin;
        } catch (error) {
            throw new AppError('Error creating admin', 500);
        }
    }

    static async deleteAdmin(id) {
        try {
            await Admin.delete(id);
        } catch (error) {
            throw new AppError('Error deleting admin', 500);
        }
    }

    static async getAllAdmins() {
        try {
            const admins = await Admin.getAll();
            return admins;
        } catch (error) {
            throw new AppError('Error getting admins', 500);
        }
    }

    static async getAdminById(id) {
        const admin = await Admin.getById(id);
        if (!admin) {
            throw new NotFoundError('Admin');
        }
        return admin;
    }

    static async restoreAdmin(id) {
        try {
            await Admin.restore(id);
        } catch (error) {
            throw new AppError('Error restoring admin', 500);
        }
    }
}

export default AdminService;
