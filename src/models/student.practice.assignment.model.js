import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';  // fijate que corregí el nombre

import Student from './student.model.js';
import Company from './company.model.js';
// import Module from './module.model.js';  // No importes aquí

const StudentPracticeAssignment = sequelize.define('StudentPracticeAssignment', {
  id_assignment: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_student: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'student',  // nombre de la tabla, en minúsculas y singular/plural según la tabla real
      key: 'id_student'
    },
    onDelete: 'CASCADE'
  },
  id_company: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'company',
      key: 'id_company'
    },
    onDelete: 'CASCADE'
  },
  id_module: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'module',  // ¡usa string con el nombre de la tabla!
      key: 'id_module'
    },
    onDelete: 'CASCADE'
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  required_hours: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  objectives: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'student_practice_assignment',
  timestamps: false
});

// Las relaciones las definís luego en index.js, no acá.

export default StudentPracticeAssignment;
