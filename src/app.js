// Importación de dependencias necesarias
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Rutas
import studentRoutes from './routes/student.routes.js'; // AÑADIDO: ruta de estudiantes

// Configuración de variables de entorno
dotenv.config();

// Inicialización de la aplicación Express
const app = express();

// Configuración de middleware
// CORS: Permite solicitudes desde diferentes orígenes
app.use(cors());

// JSON: Permite procesar datos JSON en las solicitudes
app.use(express.json());

// URL-encoded: Permite procesar datos de formularios
app.use(express.urlencoded({ extended: true }));

// Configuración de rutas
app.use('/api/students', studentRoutes); // Ruta para estudiantes

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
