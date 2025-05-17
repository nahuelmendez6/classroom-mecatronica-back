import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

/**
 * Middleware para verificar el token JWT
 */
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No se proporcionó un token de autenticación'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verificar si la sesión sigue activa
        const sessions = await User.getActiveSessions(decoded.id_user);
        const session = sessions.find(s => s.id_session === decoded.sessionId);
        
        if (!session || session.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Sesión inválida o expirada'
            });
        }

        // Agregar información del usuario al request
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};

/**
 * Middleware para verificar roles
 * @param {Array} roles - Roles permitidos
 */
export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'No autenticado'
            });
        }

        if (!roles.includes(req.user.role.name)) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permiso para realizar esta acción'
            });
        }

        next();
    };
}; 