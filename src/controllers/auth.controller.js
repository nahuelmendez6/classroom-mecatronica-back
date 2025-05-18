import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

class AuthController {
    /**
     * Inicia sesión de un usuario
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async login(req, res) {
        try {
            // Validar datos de entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    errors: errors.array()
                });
            }

            const { email, password } = req.body;
            const sessionInfo = {
                ip_address: req.ip,
                user_agent: req.headers['user-agent']
            };

            // Autenticar usuario y crear sesión
            const { user, sessionId } = await User.authenticateAndCreateSession(
                email,
                password,
                sessionInfo
            );

            // Generar token JWT
            const token = jwt.sign(
                { 
                    id_user: user.id_user,
                    email: user.email,
                    role: {
                        id_role: user.role.id_role,
                        name: user.role.name
                    },
                    sessionId 
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            res.status(200).json({
                success: true,
                message: 'Login exitoso',
                data: {
                    user,
                    token,
                    sessionId
                }
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Cierra la sesión de un usuario
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async logout(req, res) {
        try {
            const sessionId = req.user.sessionId; // Obtenido del token JWT
            const success = await User.logout(sessionId);

            if (success) {
                res.status(200).json({
                    success: true,
                    message: 'Sesión cerrada exitosamente'
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Error al cerrar la sesión'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al cerrar la sesión',
                error: error.message
            });
        }
    }

    /**
     * Obtiene las sesiones activas del usuario
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async getActiveSessions(req, res) {
        try {
            const userId = req.user.id_user; // Obtenido del token JWT
            const sessions = await User.getActiveSessions(userId);

            res.status(200).json({
                success: true,
                data: sessions
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener las sesiones activas',
                error: error.message
            });
        }
    }

    /**
     * Cierra todas las sesiones activas del usuario
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async closeAllSessions(req, res) {
        try {
            const userId = req.user.id_user; // Obtenido del token JWT
            const sessions = await User.getActiveSessions(userId);
            
            // Cerrar todas las sesiones sin excepción
            for (const session of sessions) {
                await User.logout(session.id_session);
            }

            res.status(200).json({
                success: true,
                message: 'Todas las sesiones han sido cerradas exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al cerrar las sesiones',
                error: error.message
            });
        }
    }

    /**
     * Cierra todas las sesiones de un usuario por email (solo administradores)
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async closeAllSessionsByEmail(req, res) {
        try {
            // Verificar que el usuario que hace la petición es administrador
            if (req.user.role.name !== 'Administrador') {
                return res.status(403).json({
                    success: false,
                    message: 'Solo los administradores pueden cerrar sesiones de otros usuarios'
                });
            }

            const { email } = req.body;
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'El email es requerido'
                });
            }

            // Buscar el usuario
            const user = await User.searchUser(email);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            // Obtener y cerrar todas las sesiones
            const sessions = await User.getActiveSessions(user.id_user);
            for (const session of sessions) {
                await User.logout(session.id_session);
            }

            res.status(200).json({
                success: true,
                message: 'Todas las sesiones del usuario han sido cerradas exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al cerrar las sesiones',
                error: error.message
            });
        }
    }
}

export default AuthController; 