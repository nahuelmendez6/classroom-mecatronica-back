const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Company = require('./Company');

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

module.exports = Agreement;
