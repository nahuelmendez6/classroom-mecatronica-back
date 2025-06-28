/**
 * Authentication and Authorization Middleware
 * Handles JWT token verification and role-based access control
 */

import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Role mapping for better maintainability
const ROLE_NAMES = {
    1: 'administrador',
    2: 'profesor', 
    3: 'estudiante',
    4: 'tutor'
};

/**
 * Verify JWT token from Authorization header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header is required'
            });
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid authorization format. Use Bearer token'
            });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is required'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user info to request
        req.user = decoded;
        next();
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        console.error('Token verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

/**
 * Check if user has required role(s)
 * @param {Array|string} roles - Required role(s) for access
 * @returns {Function} Express middleware function
 */
export const checkRole = (roles) => {
    return (req, res, next) => {
        try {
            // Ensure user is authenticated
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // Normalize roles to array
            const requiredRoles = Array.isArray(roles) ? roles : [roles];
            
            // Get user's role name
            const userRoleName = req.user.role?.name?.toLowerCase();
            
            if (!userRoleName) {
                return res.status(403).json({
                    success: false,
                    message: 'User role not found'
                });
            }

            // Check if user has required role
            const hasRequiredRole = requiredRoles.some(role => 
                userRoleName === role.toLowerCase()
            );

            if (!hasRequiredRole) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required roles: ${requiredRoles.join(', ')}`
                });
            }

            next();
            
        } catch (error) {
            console.error('Role verification error:', error);
            return res.status(500).json({
                success: false,
                message: 'Authorization error'
            });
        }
    };
};

/**
 * Optional authentication middleware
 * Adds user info to request if token is present, but doesn't require it
 */
export const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }
        
        next();
    } catch (error) {
        // Continue without authentication if token is invalid
        next();
    }
};

/**
 * Check if user is the owner of the resource or has admin role
 * @param {Function} getResourceUserId - Function to get resource owner's user ID
 * @returns {Function} Express middleware function
 */
export const checkOwnership = (getResourceUserId) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const resourceUserId = await getResourceUserId(req);
            
            // Allow if user is admin or owns the resource
            const isAdmin = req.user.role?.name?.toLowerCase() === 'administrador';
            const isOwner = req.user.id_user === resourceUserId;

            if (!isAdmin && !isOwner) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You can only access your own resources'
                });
            }

            next();
        } catch (error) {
            console.error('Ownership check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Authorization error'
            });
        }
    };
}; 