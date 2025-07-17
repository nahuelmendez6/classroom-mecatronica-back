/**
 * Para generalizar el concept de "empresa" vamos a llamarlo "organización"
 */
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';


const Organization = sequelize.define("Organization", {
    id_organization: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cuit: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    sector: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    },
    size: {
        type: DataTypes.STRING,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
}, {
    tableName: 'organization',
    timestamps: false,
});

export default Organization;