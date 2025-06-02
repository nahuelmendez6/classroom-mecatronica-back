import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


const roleNamesById = {
    1: 'administrador',
    2: 'profesor',
    3: 'estudiante',
    4: 'tutor'
};

/**
 * Middleware para verificar el token JWT
 */
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Se requiere iniciar sesión para acceder a este recurso'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verificar si la sesión sigue activa
        const sessions = await User.getActiveSessions(decoded.id_user);
        const session = sessions.find(s => s.id_session === decoded.sessionId);
        
        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'La sesión ha expirado o no es válida'
            });
        }

        if (session.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'La sesión ha sido cerrada'
            });
        }

        // Agregar información del usuario al request
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'La sesión ha expirado, por favor inicie sesión nuevamente'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token de autenticación inválido'
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Error de autenticación'
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
        console.log('Usuario autenticado:', req.user);

        const roleName = req.user.role.name.toLowerCase();
        console.log('Verificando rol:', roleName, 'vs roles permitidos:', roles);


        if (!roles.includes(roleName)) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permiso para realizar esta acción'
            });
        }

        next();
    };
}; 