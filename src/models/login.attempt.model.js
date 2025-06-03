import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const LoginAttempt = sequelize.define('LoginAttempt', {
    id_attempt: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_agent: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('success', 'failed'),
        allowNull: false
    },
    failure_reason: {
        type: DataTypes.STRING,
        allowNull: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    date_attempt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'login_attempt',
    timestamps: false
});

export default LoginAttempt; 