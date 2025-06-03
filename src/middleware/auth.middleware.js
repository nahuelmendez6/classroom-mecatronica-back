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
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ success: false, message: 'Error de autenticación' });
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