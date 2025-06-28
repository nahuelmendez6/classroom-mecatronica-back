# Continuation Guide - Applying Refactoring Patterns

## Overview
This guide provides examples and patterns for continuing the refactoring work on the remaining controllers and routes in the application.

## 🔄 Refactoring Patterns to Apply

### 1. **Controller Refactoring Pattern**

#### Before (Old Pattern):
```javascript
class UserController {
    static async createUser(req, res) {
        try {
            // Validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            // Business logic
            const user = await User.create(req.body);
            
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating user',
                error: error.message
            });
        }
    }
}
```

#### After (New Pattern):
```javascript
import { asyncHandler } from '../utils/errorHandler.js';
import { sendSuccess, sendValidationError } from '../utils/responseHandler.js';
import { ValidationError } from '../utils/errorHandler.js';

class UserController {
    static createUser = asyncHandler(async (req, res) => {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }

        // Business logic
        const user = await User.create(req.body);
        
        sendSuccess(res, 201, 'User created successfully', user);
    });
}
```

### 2. **Route Refactoring Pattern**

#### Before (Old Pattern):
```javascript
import { Router } from 'express';
import UserController from '../controllers/user.controller.js';

const router = Router();

router.post('/users', UserController.createUser);
router.get('/users', UserController.getUsers);
router.get('/users/:id', UserController.getUser);
```

#### After (New Pattern):
```javascript
import { Router } from 'express';
import { body, param } from 'express-validator';
import UserController from '../controllers/user.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
import { userValidation, idValidation } from '../utils/validation.js';

const router = Router();

// Validation chains
const createUserValidation = [
    userValidation.email,
    userValidation.password,
    userValidation.firstName,
    userValidation.lastName,
    userValidation.roleId
];

const updateUserValidation = [
    param('id').isInt({ min: 1 }).withMessage('Invalid user ID'),
    userValidation.firstName.optional(),
    userValidation.lastName.optional(),
    userValidation.phone.optional()
];

// Routes with proper validation and authorization
router.post('/users', createUserValidation, UserController.createUser);
router.get('/users', verifyToken, checkRole(['administrador']), UserController.getUsers);
router.get('/users/:id', verifyToken, idValidation.userId, UserController.getUser);
router.put('/users/:id', verifyToken, updateUserValidation, UserController.updateUser);
router.delete('/users/:id', verifyToken, checkRole(['administrador']), idValidation.userId, UserController.deleteUser);
```

### 3. **Service Layer Pattern**

For complex business logic, consider adding a service layer:

```javascript
// src/services/user.service.js
import User from '../models/user.model.js';
import { NotFoundError, ConflictError } from '../utils/errorHandler.js';

class UserService {
    static async createUser(userData) {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new ConflictError('User with this email already exists');
        }

        // Create user
        const user = await User.create(userData);
        return user;
    }

    static async getUserById(id) {
        const user = await User.findByPk(id, {
            include: ['role', 'student', 'teacher', 'admin']
        });
        
        if (!user) {
            throw new NotFoundError('User');
        }
        
        return user;
    }

    static async updateUser(id, updateData) {
        const user = await this.getUserById(id);
        
        // Update user
        await user.update(updateData);
        return user;
    }

    static async deleteUser(id) {
        const user = await this.getUserById(id);
        await user.destroy();
        return true;
    }
}

export default UserService;
```

### 4. **Controller Using Service Layer**

```javascript
// src/controllers/user.controller.js
import { asyncHandler } from '../utils/errorHandler.js';
import { sendSuccess, sendPaginated } from '../utils/responseHandler.js';
import UserService from '../services/user.service.js';

class UserController {
    static createUser = asyncHandler(async (req, res) => {
        const user = await UserService.createUser(req.body);
        sendSuccess(res, 201, 'User created successfully', user);
    });

    static getUser = asyncHandler(async (req, res) => {
        const user = await UserService.getUserById(req.params.id);
        sendSuccess(res, 200, 'User retrieved successfully', user);
    });

    static updateUser = asyncHandler(async (req, res) => {
        const user = await UserService.updateUser(req.params.id, req.body);
        sendSuccess(res, 200, 'User updated successfully', user);
    });

    static deleteUser = asyncHandler(async (req, res) => {
        await UserService.deleteUser(req.params.id);
        sendSuccess(res, 200, 'User deleted successfully');
    });

    static getUsers = asyncHandler(async (req, res) => {
        const { page = 1, limit = 10, search } = req.query;
        
        const { users, total } = await UserService.getUsers({
            page: parseInt(page),
            limit: parseInt(limit),
            search
        });

        sendPaginated(res, users, page, limit, total, 'Users retrieved successfully');
    });
}
```

## 📋 Checklist for Refactoring Each Controller

### 1. **Import Required Utilities**
```javascript
import { asyncHandler } from '../utils/errorHandler.js';
import { sendSuccess, sendError, sendNotFound } from '../utils/responseHandler.js';
import { ValidationError, NotFoundError } from '../utils/errorHandler.js';
```

### 2. **Wrap Methods with asyncHandler**
```javascript
static methodName = asyncHandler(async (req, res) => {
    // Method implementation
});
```

### 3. **Use Standardized Responses**
```javascript
// Instead of manual response building
sendSuccess(res, 200, 'Operation successful', data);
sendNotFound(res, 'Resource name');
sendError(res, 400, 'Error message');
```

### 4. **Add Proper Error Handling**
```javascript
// Throw specific errors instead of returning responses
if (!resource) {
    throw new NotFoundError('Resource name');
}

if (validationFailed) {
    throw new ValidationError('Validation message');
}
```

### 5. **Update Route Validation**
```javascript
// Use validation utilities
import { userValidation, idValidation } from '../utils/validation.js';

const validationChain = [
    userValidation.email,
    userValidation.password
];
```

## 🎯 Priority Order for Refactoring

1. **High Priority** (Most Used):
   - `user.controller.js` - User management
   - `moduleController.js` - Module management
   - `course.controller.js` - Course management

2. **Medium Priority**:
   - `company.controller.js` - Company management
   - `teacher.controller.js` - Teacher management
   - `admin.controller.js` - Admin management

3. **Low Priority**:
   - `company.address.controller.js` - Address management
   - `company.contact.controller.js` - Contact management
   - `studentPracticeAssignment.controller.js` - Practice assignments

## 🔧 Testing the Refactored Code

### 1. **Unit Tests**
```javascript
// tests/controllers/user.controller.test.js
import request from 'supertest';
import app from '../../src/app.js';

describe('User Controller', () => {
    test('should create user successfully', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                email: 'test@example.com',
                password: 'Password123',
                firstName: 'John',
                lastName: 'Doe',
                id_role: 3
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.email).toBe('test@example.com');
    });
});
```

### 2. **Error Handling Tests**
```javascript
test('should return validation error for invalid email', async () => {
    const response = await request(app)
        .post('/api/users')
        .send({
            email: 'invalid-email',
            password: 'Password123'
        });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Validation failed');
});
```

## 📈 Benefits of Following These Patterns

1. **Consistency**: All controllers follow the same structure
2. **Maintainability**: Easy to understand and modify
3. **Error Handling**: Centralized and consistent error management
4. **Testing**: Easier to write and maintain tests
5. **Documentation**: Self-documenting code with clear patterns
6. **Performance**: Better error handling and response formatting

## 🚀 Next Steps

1. **Apply to High Priority Controllers**: Start with user, module, and course controllers
2. **Add Service Layer**: For complex business logic
3. **Update Routes**: Apply validation patterns to all routes
4. **Add Tests**: Implement comprehensive test suite
5. **Documentation**: Update API documentation with new response formats

By following these patterns, you'll create a more maintainable, reliable, and professional codebase. 