import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ies9021_PPII-SEGUIMIENTO-MECATRONICA',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Función para probar la conexión
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a la base de datos establecida correctamente');
        connection.release();
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        throw error;
    }
};

export { pool, testConnection }; 