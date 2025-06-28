/**
 * User Controller
 * Handles user management operations including CRUD operations and user-specific functionality
 */

import User from '../models/user.model.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { pool } from '../../config/database.js';
import { asyncHandler } from '../utils/errorHandler.js';
import { sendSuccess, sendValidationError, sendNotFound, sendError } from '../utils/responseHandler.js';
import { ValidationError, NotFoundError, ConflictError } from '../utils/errorHandler.js';

class UserController {
    /**
     * Search user by email
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static searchUser = asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }

        const { email } = req.body;
        const user = await User.searchUser(email);

        if (!user) {
            throw new NotFoundError('User');
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        sendSuccess(res, 200, 'User found', userWithoutPassword);
    });

    /**
     * Create a new user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static createUser = asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }

        const {
            email,
            password,
            confirmPassword,
            name,
            lastname,
            dni,
            phone_number,
            id_role,
            id_module,
            observations,
            id_company,
            phone,
            position
        } = req.body;

        // Validate password confirmation
        if (password && password !== confirmPassword) {
            throw new ValidationError('Passwords do not match');
        }

        // Check if email already exists
        const existingUser = await User.searchUser(email);
        if (existingUser) {
            throw new ConflictError('Email is already registered');
        }

        // Validate role exists
        const [roles] = await pool.query('SELECT * FROM role WHERE id_role = ?', [id_role]);
        if (!roles.length) {
            throw new ValidationError('Invalid role');
        }

        // Generate password from DNI if not provided
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        } else {
            if (!dni) {
                throw new ValidationError('DNI is required to generate password');
            }
            hashedPassword = await bcrypt.hash(dni.toString(), 10);
        }

        // Create user
        const userId = await User.createUser({
            email,
            password: hashedPassword,
            id_role,
            name,
            lastname,
            dni,
            phone_number,
            id_module,
            observations,
            id_company,
            position,
            phone
        });

        sendSuccess(res, 201, 'User created successfully', { id_user: userId });
    });

    /**
     * Update an existing user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static updateUser = asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }

        const { id_user } = req.params;
        const updateData = { ...req.body };

        // Hash password if being updated
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const success = await User.updateUser(id_user, updateData);

        if (!success) {
            throw new NotFoundError('User');
        }

        sendSuccess(res, 200, 'User updated successfully');
    });

    /**
     * Delete a user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static deleteUser = asyncHandler(async (req, res) => {
        const { id_user } = req.params;

        const success = await User.deleteUser(id_user);

        if (!success) {
            throw new NotFoundError('User');
        }

        sendSuccess(res, 200, 'User deleted successfully');
    });

    /**
     * Get all users with pagination and search
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getAllUsers = asyncHandler(async (req, res) => {
        const { page = 1, limit = 10, search = '', role = '' } = req.query;
        
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT u.*, r.name as role_name 
            FROM user u 
            LEFT JOIN role r ON u.id_role = r.id_role 
            WHERE 1=1
        `;
        const queryParams = [];

        // Add search filter
        if (search) {
            query += ` AND (u.name LIKE ? OR u.lastname LIKE ? OR u.email LIKE ?)`;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        // Add role filter
        if (role) {
            query += ` AND r.name = ?`;
            queryParams.push(role);
        }

        // Add pagination
        query += ` ORDER BY u.name, u.lastname LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), offset);

        const [users] = await pool.query(query, queryParams);

        // Get total count for pagination
        let countQuery = `
            SELECT COUNT(*) as total 
            FROM user u 
            LEFT JOIN role r ON u.id_role = r.id_role 
            WHERE 1=1
        `;
        const countParams = [];

        if (search) {
            countQuery += ` AND (u.name LIKE ? OR u.lastname LIKE ? OR u.email LIKE ?)`;
            const searchTerm = `%${search}%`;
            countParams.push(searchTerm, searchTerm, searchTerm);
        }

        if (role) {
            countQuery += ` AND r.name = ?`;
            countParams.push(role);
        }

        const [countResult] = await pool.query(countQuery, countParams);
        const total = countResult[0].total;

        // Remove passwords from response
        const usersWithoutPasswords = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        sendSuccess(res, 200, 'Users retrieved successfully', {
            users: usersWithoutPasswords,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    });

    /**
     * Get all teachers
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getAllTeachers = asyncHandler(async (req, res) => {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT u.*, r.name as role_name 
            FROM user u 
            LEFT JOIN role r ON u.id_role = r.id_role 
            WHERE r.name = 'Profesor'
        `;
        const queryParams = [];

        if (search) {
            query += ` AND (u.name LIKE ? OR u.lastname LIKE ? OR u.email LIKE ?)`;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        query += ` ORDER BY u.name, u.lastname LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), offset);

        const [teachers] = await pool.query(query, queryParams);

        // Get total count
        let countQuery = `
            SELECT COUNT(*) as total 
            FROM user u 
            LEFT JOIN role r ON u.id_role = r.id_role 
            WHERE r.name = 'Profesor'
        `;
        const countParams = [];

        if (search) {
            countQuery += ` AND (u.name LIKE ? OR u.lastname LIKE ? OR u.email LIKE ?)`;
            const searchTerm = `%${search}%`;
            countParams.push(searchTerm, searchTerm, searchTerm);
        }

        const [countResult] = await pool.query(countQuery, countParams);
        const total = countResult[0].total;

        // Remove passwords from response
        const teachersWithoutPasswords = teachers.map(teacher => {
            const { password, ...teacherWithoutPassword } = teacher;
            return teacherWithoutPassword;
        });

        sendSuccess(res, 200, 'Teachers retrieved successfully', {
            teachers: teachersWithoutPasswords,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    });

    /**
     * Get user by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getUserById = asyncHandler(async (req, res) => {
        const { id_user } = req.params;

        const query = `
            SELECT u.*, r.name as role_name 
            FROM user u 
            LEFT JOIN role r ON u.id_role = r.id_role 
            WHERE u.id_user = ?
        `;
        
        const [users] = await pool.query(query, [id_user]);

        if (!users.length) {
            throw new NotFoundError('User');
        }

        const user = users[0];
        const { password, ...userWithoutPassword } = user;

        sendSuccess(res, 200, 'User retrieved successfully', userWithoutPassword);
    });

    /**
     * Get all roles
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getAllRoles = asyncHandler(async (req, res) => {
        const [roles] = await pool.query('SELECT * FROM role ORDER BY name');

        sendSuccess(res, 200, 'Roles retrieved successfully', roles);
    });

    /**
     * Get all modules
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getAllModules = asyncHandler(async (req, res) => {
        const [modules] = await pool.query('SELECT * FROM module ORDER BY name');

        sendSuccess(res, 200, 'Modules retrieved successfully', modules);
    });

    /**
     * Get user statistics
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getUserStats = asyncHandler(async (req, res) => {
        // Get total users count
        const [totalUsersResult] = await pool.query('SELECT COUNT(*) as total FROM user');
        const totalUsers = totalUsersResult[0].total;

        // Get users by role
        const [usersByRole] = await pool.query(`
            SELECT r.name as role, COUNT(u.id_user) as count 
            FROM role r 
            LEFT JOIN user u ON r.id_role = u.id_role 
            GROUP BY r.id_role, r.name 
            ORDER BY r.name
        `);

        // Get recent users (last 30 days)
        const [recentUsersResult] = await pool.query(`
            SELECT COUNT(*) as count 
            FROM user 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `);
        const recentUsers = recentUsersResult[0].count;

        const stats = {
            totalUsers,
            usersByRole,
            recentUsers,
            lastUpdated: new Date().toISOString()
        };

        sendSuccess(res, 200, 'User statistics retrieved successfully', stats);
    });
}

export default UserController;