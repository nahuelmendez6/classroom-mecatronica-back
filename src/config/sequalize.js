/**
 * Database configuration using Sequelize
 * Handles connection to MySQL database with proper error handling
 */

import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    process.exit(1);
}

// Create Sequelize instance with enhanced configuration
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 10, // Maximum number of connection instances
            min: 0,  // Minimum number of connection instances
            acquire: 30000, // Maximum time to acquire a connection
            idle: 10000 // Maximum time a connection can be idle
        },
        dialectOptions: {
            // Enable SSL if required
            ...(process.env.DB_SSL === 'true' && {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            })
        },
        timezone: '+00:00' // Use UTC timezone
    }
);

/**
 * Test database connection
 */
export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

export default sequelize;