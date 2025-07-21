// src/models/studentCourse.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const StudentCourse = sequelize.define('StudentCourse', {
  id_student_course: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_student: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_course: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  enrollment_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  }
}, {
  tableName: 'student_course',
  timestamps: false
});

export default StudentCourse;
