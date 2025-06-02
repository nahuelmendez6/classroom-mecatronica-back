// Importación de dependencias necesarias
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import courseRoutes from './routes/course.routes.js';
import companyRoutes from './routes/company.routes.js';
import companyAddressRoutes from './routes/company.address.routes.js';
import studentPracticeRoutes from './routes/studentPracticeAssignment.routes.js';

import sequelize from './config/sequalize.js';

import './models/index.js';

// Configuración de variables de entorno
dotenv.config();

// Inicialización de la aplicación Express
const app = express();


sequelize.sync({ alter: false }) // O false si no querés modificar la estructura
  .then(() => console.log('Modelos sincronizados con la base de datos'))
  .catch(err => console.error('Error sincronizando modelos:', err));



// Configuración de middleware
// CORS: Permite solicitudes desde diferentes orígenes
app.use(cors());
// JSON: Permite procesar datos JSON en las solicitudes
app.use(express.json());
// URL-encoded: Permite procesar datos de formularios
app.use(express.urlencoded({ extended: true }));

// Configuración de rutas
// Todas las rutas de administradores comenzarán con /api/admins
app.use('/api/admins', adminRoutes);

// Todas las rutas de autenticacion comenzarán con /api/auth'
app.use('/api/auth', authRoutes);

// Todas las rutas de usuarios comenzarán con /api/users
app.use('/api/users', userRoutes);

// Todas las rutas de módulos comenzarán con /api/modules
app.use('/api/modules', moduleRoutes);

// Todas las rutas de cursos comenzarán con /api/courses
app.use('/api/courses', courseRoutes);

// Todas las rutas de empresas comenzaran con /api/empresa
app.use('/api/companies', companyRoutes);

// Todas las rutas de direcciones comenzaran con /api/address
app.use('/api/address/', companyAddressRoutes);


// Todas las rutas de asignacion de practicas
app.use('/api/practice-assignments', studentPracticeRoutes);


// Middleware de manejo de errores global
// Se ejecuta cuando ocurre un error en cualquier parte de la aplicación
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        // En desarrollo mostramos el error, en producción no
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});



// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
