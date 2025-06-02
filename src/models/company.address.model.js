import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';
import Company from '../models/company.model.js';

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
    allowNull: false,
    references: {
      model: Company,
      key: 'id_company',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'company_address',
  timestamps: false,
});

Company.hasMany(CompanyAddress, { foreignKey: 'id_company', onDelete: 'CASCADE' });
CompanyAddress.belongsTo(Company, { foreignKey: 'id_company' });

export default CompanyAddress;
