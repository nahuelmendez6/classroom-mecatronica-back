import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const Session = sequelize.define('Session', {
    id_session: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER,
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
    date_start: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    date_end: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'closed'),
        defaultValue: 'active'
    }
}, {
    tableName: 'session',
    timestamps: false
});


// Modelo Session (por ejemplo, models/Session.js)

Session.closeSession = async function (sessionId) {
    try {
        const session = await this.findByPk(sessionId);

        if (!session) {
            console.warn(`Sesión ${sessionId} no encontrada`);
            return false;
        }

        session.status = 'inactive';
        session.date_end = new Date();

        await session.save();

        return true;
    } catch (error) {
        console.error("Error al cerrar la sesión:", error);
        throw error;
    }
};


export default Session; 