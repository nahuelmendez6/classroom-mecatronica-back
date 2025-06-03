import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';


import Student from './student.model.js';
import Company from './company.model.js';
import Module from './module.model.js';


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
      model: Student,
      key: 'id_student'
    },
    onDelete: 'CASCADE'
  },
  id_company: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Company,
      key: 'id_company'
    },
    onDelete: 'CASCADE'
  },
  id_module: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Module,
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


// DEFINICIÓN DE RELACIONES 
Student.hasMany(StudentPracticeAssignment, { foreignKey: 'id_student', onDelete: 'CASCADE' });
Company.hasMany(StudentPracticeAssignment, { foreignKey: 'id_company', onDelete: 'CASCADE' });
// Module.hasMany(StudentPracticeAssignment, { foreignKey: 'id_module', onDelete: 'CASCADE' });

StudentPracticeAssignment.belongsTo(Student, { foreignKey: 'id_student' });
StudentPracticeAssignment.belongsTo(Company, { foreignKey: 'id_company' });
// StudentPracticeAssignment.belongsTo(Module, { foreignKey: 'id_module' });


export default StudentPracticeAssignment;
