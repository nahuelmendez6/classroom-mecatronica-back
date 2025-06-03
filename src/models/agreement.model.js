import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';
import Company from './company.model.js';

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
    allowNull: false,
    references: {
      model: Company,
      key: 'id_company',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'agreement',
  timestamps: false,
});

Company.hasMany(Agreement, { foreignKey: 'id_company', onDelete: 'CASCADE' });
Agreement.belongsTo(Company, { foreignKey: 'id_company' });

export default Agreement;
