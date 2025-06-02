import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';


const Company = sequelize.define("Company", {
    id_company: {
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
        allowNull: false,
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
}, {
    tableName: 'company',
    timestamps: false,
});

export default Company;