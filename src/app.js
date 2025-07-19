// Importación de dependencias necesarias
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import moduleRoutes from './routes/moduleRoutes.js';



//| Importación de rutas de cursos y profesores

// import courseRoutes from './routes/course.routes.js';
import courseRoutes from './course/course.routes.js';
import teacherCourseRoutes from './teacher-course/teacher.course.routes.js';



import companyRoutes from './routes/company.routes.js';
import companyAddressRoutes from './routes/company.address.routes.js';
import companyContactRoutes from './routes/company.contact.routes.js';
import studentPracticeRoutes from './routes/studentPracticeAssignment.routes.js';
// import teacherRoutes from './routes/teacher.routes.js';

import teacherAdminRoutes from './teacher/teacher.admin.routes.js';
import teacherSelfRoutes from './teacher/teacher.self.routes.js';

// =============== Rutas de organización ===============
import organizationRoutes from './organization/organization.routes.js';
import organizationAddressRoutes from './organization/organization.address.routes.js';
import organizationContactRoutes from './organization/organization.contact.routes.js';

import subModuleRoutes from './routes/sub.modules.routes.js';
// import taskRoutes from './routes/task.routes.js';
import studentCourseRoute from './routes/student.course.js';
import studentRoutes from './routes/student.routes.js';
import groupRoutes from './routes/group.routes.js'; // Added
import taskTypeRoutes from './routes/task.types.routes.js';
import sequelize from './config/sequalize.js';

import './models/index.js';
import { ValidationError } from 'sequelize';
import { AppError, NotFoundError, ConflictError } from './utils/errorHandler.js';
import { sendError, sendValidationError, sendNotFound } from './utils/responseHandler.js';



// Configuración de variables de entorno
dotenv.config();

console.log('Variables de entorno cargadas:');
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
// app.use('/api/teacher', teacherRoutes); // Profesores
app.use('/api/teachers', teacherAdminRoutes); // Profesores (admin)
app.use('/api/teacher/self', teacherSelfRoutes); // Profesores (self)
app.use('/api/companies', companyRoutes); // Empresas

// 3. Rutas de módulos y submódulos
app.use('/api/modules', moduleRoutes);      // Módulos
app.use('/api/v1/submodules', subModuleRoutes);
// app.use('/api/v1/tasks', taskRoutes); // Submódulos

// ======================================================================================
// 4. Rutas de cursos y asignaciones
app.use('/api/courses', courseRoutes); // Cursos

app.use('/api/teacher-courses', teacherCourseRoutes); // Cursos de profesores

// app.use('/api/student-course', studentCourseRoute); // Asignación estudiante-curso
// app.use('/api/practice-assignments', studentPracticeRoutes); // Asignación de prácticas
// app.use('/api/groups', groupRoutes); // Grupos





// ======================================================================================


// 5. Rutas de empresas: direcciones y contactos
app.use('/api/address', companyAddressRoutes); // Direcciones de empresa
app.use('/api/company-contacts', companyContactRoutes); // Contactos de empresa


app.use('/api/organizations', organizationRoutes); // Organizaciones
app.use('/api/organization-addresses', organizationAddressRoutes); // Direcciones de organizaciones
app.use('/api/organization-contacts', organizationContactRoutes); // Contactos de organizaciones


// 6. Rutas de tareas y tipos de tareas

app.use('/api/task-types', taskTypeRoutes); // Tipos de tareas

// 7. Rutas de tareas (si es necesario, se puede separar en otro archivo)
import taskRoutes from './routes/task.routes.js';
app.use('/api/tasks', taskRoutes); // Tareas


// ... resto de la configuración


// Middleware de manejo de errores global mejorado
app.use((err, req, res, next) => {
    // Validaciones
    if (err instanceof ValidationError) {
        // Si el error tiene un array de errores, lo usamos, si no, solo el mensaje
        return sendValidationError(res, err.errors || [{ message: err.message }]);
    }
    // No encontrado
    if (err instanceof NotFoundError) {
        return sendNotFound(res, err.message);
    }
    // Conflicto
    if (err instanceof ConflictError) {
        return sendError(res, 409, err.message);
    }
    // Errores personalizados
    if (err instanceof AppError) {
        return sendError(res, err.statusCode || 500, err.message);
    }
    // Otros errores
    return sendError(res, 500, 'Error interno del servidor', process.env.NODE_ENV === 'development' ? err.stack : undefined);
});



// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
