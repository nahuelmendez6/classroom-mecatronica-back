import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.model.js';
import Company from './company.model.js';

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

// Asociaciones
CompanyContact.belongsTo(User, {
  foreignKey: 'id_user',
  onDelete: 'CASCADE'
});

CompanyContact.belongsTo(Company, {
  foreignKey: 'id_company',
  onDelete: 'CASCADE'
});

export default CompanyContact;
