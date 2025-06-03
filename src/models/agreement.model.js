import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const Agreement = sequelize.define('Agreement', {
  id_agreement: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  document_url: {
    type: DataTypes.TEXT,
  },
  id_company: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'agreement',
  timestamps: false,
});

export default Agreement;
