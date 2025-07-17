import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const OrganizationAddress = sequelize.define('OrganizationAddress', {
  id_org_address: {
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
  id_organization: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'organization_address',
  timestamps: false,
});

export default OrganizationAddress;
