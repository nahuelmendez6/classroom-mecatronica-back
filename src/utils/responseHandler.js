/**
 * Response handler utility for Express applications.
 * Provides standardized response methods for consistent API responses
 */

/**
 * Send a succesful response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {string} message - Success message
 * @param {*} data - Data to be sent in the response
 * 
 */

export const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
    const response = {
        success: true,
        message,
        ...(data && { data })
    };

    res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {string} message - Error message
 * @param {*} error - Error  details (only in development mode)
 */

export const sendError = (res, statusCode = 500, message = 'Internal Server Error', error = null) => {
    const response = {
        success: false,
        message,
        ...(error && { error: process.env.NODE_ENV === 'development' ? error : undefined })
    };

    res.status(statusCode).json(response);
}

/**
 * Send a validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors array
 */
export const sendValidationError = (res, errors) => {
    res.status(400).json({
        success: false,
        message: 'Validation Failed',
        errors
    }); 
};

/**
 * Send a not found response
 * @param {Object} res - Express response object
 * @param {string} resource - Resource name that was not found
 */
export const sendNotFound = (res, resource) => {
    res.status(404).json({
        success: false,
        message: `${resource} not found`
    });
};

/**
 * Send an unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Unauthorized message
 */
export const sendUnauthorized = (res, message = 'Unauthorized') => {
    res.status(401).json({
        success: false,
        message
    });
};

/**
 * Send a forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Forbidden message  
 * 
 */
export const sendForbidden = (res, message = 'Access denied') => {
    res.status(403).json({
        success: false,
        message
    });
};

/**
 * Send a paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Response data
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @param {string} message - Success message
 */
export const sendPaginated = (res, data, page, limit, total, message = 'Data retrieved successfully') => {
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
        success: true,
        message,
        data,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    });
}; 