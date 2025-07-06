import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import { pool } from "../config/database.js";
import { AppError, NotFoundError, ConflictError } from "../utils/errorHandler.js";
import { ValidationError } from "sequelize";

function cleanData(data) {
    return Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
    );
}

class UserService {
    static async searchUserByEmail(email) {
        const user = await User.searchUser(email);
        if (!user) throw new NotFoundError('Usuario');

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    static async createUser(data) {
        const existingUser = await User.searchUser(data.email);
        if (existingUser) throw new ConflictError('El email ya está registrado');

        const [roles] = await pool.query('SELECT * FROM role WHERE id_role = ?', [data.id_role]);
        if (!roles.length) throw new ValidationError('Rol no válido');

        let rawPassword = data.password;
        if (!rawPassword) {
            if (!data.dni) {
                throw new ValidationError('DNI o contraseña son requeridos para generar la contraseña');
            }
            rawPassword = data.dni.toString();
        }

        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        const cleanedData = cleanData({ ...data, password: hashedPassword });
        const userId = await User.createUser(cleanedData);

        return { id_user: userId };
    }

    static async updateUser(id, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        const success = await User.updateUser(id, cleanData(data));
        if (!success) throw new NotFoundError('Usuario');

        return true;
    }

    static async deleteUser(id) {
        const success = await User.updateUser(id, {
            is_active: false,
            is_deleted: true,
            deleted_at: new Date()
        });

        if (!success) throw new NotFoundError('Usuario');

        const sessions = await User.getActiveSessions(id);
        for (const session of sessions) {
            await User.logout(session.id_session);
        }

        return true;
    }

    static async getAllUsers() {
        const users = await User.getAllUsers();
        return users.map(({ password, ...rest }) => rest);
    }

    static async getAllTeachers() {
        const teachers = await User.getTeachers();
        if (!Array.isArray(teachers)) {
            throw new Error('La respuesta de la base de datos no es un array de profesores');
        }
        return teachers.map(({ password, ...rest }) => rest);
    }

    static async getAllRoles() {
        return await User.getAllRoles();
    }

    static async getAllModules() {
        return await User.getAllModules();
    }

    static async getUserStats() {
        return await User.getUserStats();
    }
}

export default UserService;
