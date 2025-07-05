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
import teacherRoutes from './routes/teacher.routes.js';
import subModuleRoutes from './routes/sub.modules.routes.js';
import studentCourseRoute from './routes/student.course.js';
import studentRoutes from './routes/student.routes.js';

import sequelize from './config/sequalize.js';

import './models/index.js';



// Configuración de variables de entorno
dotenv.config();

console.log('🔐 Variables de entorno cargadas:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '****' : 'NO DEFINIDA');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);


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


// ====================
// Configuración de rutas
// ====================

// 1. Rutas de autenticación y administración
app.use('/api/admins', adminRoutes); // Administradores
app.use('/api/auth', authRoutes);    // Autenticación
app.use('/api/users', userRoutes);   // Usuarios

// 2. Rutas de entidades principales
app.use('/api/students', studentRoutes); // Estudiantes
app.use('/api/teachers', teacherRoutes); // Profesores
app.use('/api/companies', companyRoutes); // Empresas

// 3. Rutas de módulos y submódulos
app.use('/api/modules', moduleRoutes);      // Módulos
app.use('/api/sub-modules', subModuleRoutes); // Submódulos

// 4. Rutas de cursos y asignaciones
app.use('/api/courses', courseRoutes); // Cursos
app.use('/api/student-course', studentCourseRoute); // Asignación estudiante-curso
app.use('/api/practice-assignments', studentPracticeRoutes); // Asignación de prácticas

// 5. Rutas de empresas: direcciones y contactos
app.use('/api/address', companyAddressRoutes); // Direcciones de empresa

// ... resto de la configuración

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
