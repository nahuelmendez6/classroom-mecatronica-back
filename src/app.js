/**
 * Main application entry point
 * Configures Express server, middleware, routes, and error handling
 */

// Importación de dependencias necesarias
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importación de rutas
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import courseRoutes from './routes/course.routes.js';
import companyRoutes from './routes/company.routes.js';
import companyAddressRoutes from './routes/company.address.routes.js';
import studentPracticeRoutes from './routes/studentPracticeAssignment.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import subModuleRoutes from './routes/sub.modules.routes.js';

// Importación de configuración de base de datos
import sequelize from './config/sequalize.js';
import './models/index.js';

// Import error handling utilities
import { initializeErrorHandlers } from './utils/errorHandler.js';

// Configuración de variables de entorno
dotenv.config();

// Inicialización de la aplicación Express
const app = express();

/**
 * Configuración de la base de datos
 * Sincroniza los modelos con la base de datos
 */
const initializeDatabase = async () => {
    try {
        await sequelize.sync({ alter: false });
        console.log('✅ Database models synchronized');
    } catch (error) {
        console.error('❌ Database sync error:', error);
        process.exit(1);
    }
};

/**
 * Configuración de middleware
 */
const configureMiddleware = () => {
    // CORS: Permite solicitudes desde diferentes orígenes
    app.use(cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        credentials: true
    }));
    
    // JSON: Permite procesar datos JSON en las solicitudes
    app.use(express.json({ limit: '10mb' }));
    
    // URL-encoded: Permite procesar datos de formularios
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
};

/**
 * Configuración de rutas de la API
 */
const configureRoutes = () => {
    // Rutas de autenticación
    app.use('/api/auth', authRoutes);
    
    // Rutas de administradores
    app.use('/api/admins', adminRoutes);
    
    // Rutas de usuarios
    app.use('/api/users', userRoutes);
    
    // Rutas de módulos
    app.use('/api/modules', moduleRoutes);
    
    // Rutas de sub-módulos
    app.use('/api/sub-modules', subModuleRoutes);
    
    // Rutas de cursos
    app.use('/api/courses', courseRoutes);
    
    // Rutas de empresas
    app.use('/api/companies', companyRoutes);
    
    // Rutas de direcciones de empresas
    app.use('/api/address', companyAddressRoutes);
    
    // Rutas de profesores
    app.use('/api/teachers', teacherRoutes);
    
    // Rutas de asignación de prácticas
    app.use('/api/practice-assignments', studentPracticeRoutes);
    
    // Ruta de health check
    app.get('/api/health', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Server is running',
            timestamp: new Date().toISOString()
        });
    });
};

/**
 * Middleware de manejo de errores global
 * Se ejecuta cuando ocurre un error en cualquier parte de la aplicación
 */
const configureErrorHandling = () => {
    // Middleware para manejar rutas no encontradas
    app.use('*', (req, res) => {
        res.status(404).json({
            success: false,
            message: `Route ${req.originalUrl} not found`
        });
    });

    // Middleware de manejo de errores
    app.use((err, req, res, next) => {
        console.error('❌ Application error:', err);
        
        // Determinar el código de estado apropiado
        const statusCode = err.statusCode || 500;
        
        res.status(statusCode).json({
            success: false,
            message: err.message || 'Internal server error',
            // Solo mostrar detalles del error en desarrollo
            ...(process.env.NODE_ENV === 'development' && {
                error: err.stack
            })
        });
    });
};

/**
 * Inicialización del servidor
 */
const startServer = async () => {
    try {
        // Inicializar global error handlers
        initializeErrorHandlers();
        
        // Inicializar base de datos
        await initializeDatabase();
        
        // Configurar middleware
        configureMiddleware();
        
        // Configurar rutas
        configureRoutes();
        
        // Configurar manejo de errores
        configureErrorHandling();
        
        // Iniciar servidor
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Server startup error:', error);
        process.exit(1);
    }
};

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down...');
    process.exit(0);
});

// Iniciar la aplicación
startServer();
