import { DataTypes } from "sequelize";
import sequelize from "../config/sequalize.js";

const OrganizationAgreement = sequelize.define('OrganizationAgreement', {
  id_agreement: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  document_url: {
    type: DataTypes.TEXT,
  },
  id_company: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'organization_agreement',
  timestamps: false,
}); 

export default OrganizationAgreement;