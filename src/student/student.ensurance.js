import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const StudentEnsurance = sequelize.define('StudentEnsurance', {
  id_student_ensurance: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_student: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  document_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: 'id_student',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  }
}, {
  tableName: 'student_ensurance',
  timestamps: false
});

export default StudentEnsurance;