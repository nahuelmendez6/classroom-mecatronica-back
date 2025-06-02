// src/models/student.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const Student = sequelize.define('Student', {
  id_student: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'student',
  timestamps: false
});

export default Student;
