/**
 * Authentication Controller
 * Handles user authentication, session management, and authorization
 */

import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { sendSuccess, sendError, sendValidationError, sendUnauthorized, sendForbidden, sendNotFound } from '../utils/responseHandler.js';
import { asyncHandler, AuthenticationError, ValidationError, AuthorizationError, NotFoundError } from '../utils/errorHandler.js';

class AuthController {
    /**
     * Authenticate user and create session
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static login = asyncHandler(async (req, res) => {
        // Validate input data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }

        const { email, password } = req.body;
        const sessionInfo = {
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        };

        // Authenticate user and create session
        const { user, sessionId } = await User.authenticateAndCreateSession(
            email,
            password,
            sessionInfo
        );

        // Generate JWT token
        const token = jwt.sign(
            { 
                id_user: user.id_user,
                email: user.email,
                role: {
                    id_role: user.role.id_role,
                    name: user.role.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                },
                sessionId 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        sendSuccess(res, 200, 'Login successful', {
            user,
            token,
            sessionId
        });
    });

    /**
     * Logout user and invalidate session
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static logout = asyncHandler(async (req, res) => {
        const sessionId = req.user.sessionId;
        
        if (!sessionId) {
            throw new AuthenticationError('No active session found');
        }

        const success = await User.logout(sessionId);
        
        if (!success) {
            throw new AuthenticationError('Failed to logout session');
        }

        sendSuccess(res, 200, 'Logout successful');
    });

    /**
     * Get user's active sessions
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static getActiveSessions = asyncHandler(async (req, res) => {
        const userId = req.user.id_user;
        const sessions = await User.getActiveSessions(userId);

        sendSuccess(res, 200, 'Active sessions retrieved', sessions);
    });

    /**
     * Close all active sessions for the current user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static closeAllSessions = asyncHandler(async (req, res) => {
        const userId = req.user.id_user;
        const sessions = await User.getActiveSessions(userId);
        
        // Close all sessions
        const logoutPromises = sessions.map(session => 
            User.logout(session.id_session)
        );
        
        await Promise.all(logoutPromises);

        sendSuccess(res, 200, 'All sessions closed successfully');
    });

    /**
     * Close all sessions for a user by email (admin only)
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static closeAllSessionsByEmail = asyncHandler(async (req, res) => {
        // Verify admin role
        if (req.user.role.name.toLowerCase() !== 'administrador') {
            throw new AuthorizationError('Only administrators can close sessions for other users');
        }

        const { email } = req.body;
        
        if (!email) {
            throw new ValidationError('Email is required');
        }

        // Find user
        const user = await User.searchUser(email);
        if (!user) {
            throw new NotFoundError('User');
        }

        // Get and close all sessions
        const sessions = await User.getActiveSessions(user.id_user);
        const logoutPromises = sessions.map(session => 
            User.logout(session.id_session)
        );
        
        await Promise.all(logoutPromises);

        sendSuccess(res, 200, 'All user sessions closed successfully');
    });

    /**
     * Refresh user session
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static refreshSession = asyncHandler(async (req, res) => {
        const userId = req.user.id_user;
        const sessionId = req.user.sessionId;

        // Verify session is still valid
        const session = await User.getSessionById(sessionId);
        if (!session || session.id_user !== userId) {
            throw new AuthenticationError('Invalid session');
        }

        // Generate new token
        const token = jwt.sign(
            { 
                id_user: req.user.id_user,
                email: req.user.email,
                role: req.user.role,
                sessionId 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        sendSuccess(res, 200, 'Session refreshed', { token });
    });
}

export default AuthController; 