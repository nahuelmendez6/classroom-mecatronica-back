/**
 * Error Handling Utilities
 * Centralized error management and custom error classes
 */

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Custom error class for validation errors
 */
export class ValidationError extends AppError {
    constructor(message, errors = []) {
        super(message, 400);
        this.errors = errors;
    }
}

/**
 * Custom error class for authentication errors
 */
export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
    }
}

/**
 * Custom error class for authorization errors
 */
export class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403);
    }
}

/**
 * Custom error class for not found errors
 */
export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
    }
}

/**
 * Custom error class for conflict errors
 */
export class ConflictError extends AppError {
    constructor(message = 'Resource conflict') {
        super(message, 409);
    }
}

/**
 * Handle Sequelize errors and convert them to appropriate HTTP responses
 * @param {Error} error - Sequelize error
 * @returns {AppError} - Appropriate application error
 */
export const handleSequelizeError = (error) => {
    if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => ({
            field: err.path,
            message: err.message,
            value: err.value
        }));
        return new ValidationError('Validation failed', errors);
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors[0]?.path || 'field';
        return new ConflictError(`${field} already exists`);
    }
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return new ValidationError('Referenced resource does not exist');
    }
    
    if (error.name === 'SequelizeDatabaseError') {
        return new AppError('Database operation failed', 500);
    }
    
    return new AppError('Database error', 500);
};

/**
 * Async error handler wrapper for Express routes
 * @param {Function} fn - Async route handler function
 * @returns {Function} - Express middleware function
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Handle unhandled promise rejections
 */
export const handleUnhandledRejection = () => {
    process.on('unhandledRejection', (err) => {
        console.error('❌ Unhandled Promise Rejection:', err);
        process.exit(1);
    });
};

/**
 * Handle uncaught exceptions
 */
export const handleUncaughtException = () => {
    process.on('uncaughtException', (err) => {
        console.error('❌ Uncaught Exception:', err);
        process.exit(1);
    });
};

/**
 * Initialize global error handlers
 */
export const initializeErrorHandlers = () => {
    handleUnhandledRejection();
    handleUncaughtException();
};

/**
 * Log error with context information
 * @param {Error} error - Error object
 * @param {Object} context - Additional context information
 */
export const logError = (error, context = {}) => {
    const errorLog = {
        timestamp: new Date().toISOString(),
        error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
            statusCode: error.statusCode
        },
        context
    };
    
    console.error('❌ Error Log:', JSON.stringify(errorLog, null, 2));
}; 