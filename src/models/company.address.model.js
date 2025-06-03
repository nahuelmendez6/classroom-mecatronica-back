import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const CompanyAddress = sequelize.define('CompanyAddress', {
  id_company_address: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  street: {
    type: DataTypes.STRING,
  },
  number: {
    type: DataTypes.STRING(10),
  },
  city: {
    type: DataTypes.STRING,
  },
  department: {
    type: DataTypes.STRING,
  },
  id_company: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'company_address',
  timestamps: false,
});

export default CompanyAddress;
