import { DataTypes } from "sequelize";
import sequelize from '../config/sequalize.js';
import Student from "./student.model.js";

const StudentAgreement = sequelize.define('StudentAgreement', {
  id_student_agreement: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  document_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  id_student: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: 'id_student',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'student_agreement',
  timestamps: false, // Si no tienes createdAt/updatedAt
});

export default StudentAgreement;