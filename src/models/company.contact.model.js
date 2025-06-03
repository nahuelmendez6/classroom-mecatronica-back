import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const CompanyContact = sequelize.define('CompanyContact', {
  id_contact: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  position: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_company: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'company_contact',
  timestamps: false
});

export default CompanyContact;
