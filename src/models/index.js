// src/models/index.js
import sequelize from '../config/sequalize.js';
import User from './user.model.js';
import Role from './role.model.js';
import Student from './student.model.js';
import Teacher from './teacher.model.js';
import Admin from './admin.model.js';
import Company from './company.model.js';
import CompanyContact from './company.contact.model.js';
import CompanyAddress from './company.address.model.js';
import Agreement from './agreement.model.js';
import StudentModule from './student_module.model.js';
import StudentPracticeAssignment from './student.practice.assignment.model.js';
import Module from './module.model.js';
import Session from './session.model.js';

// Relaciones User
User.belongsTo(Role, { foreignKey: 'id_role' });
User.hasOne(Student, { foreignKey: 'id_user' });
User.hasOne(Teacher, { foreignKey: 'id_user' });
User.hasOne(Admin, { foreignKey: 'id_user' });
User.hasOne(CompanyContact, { foreignKey: 'id_user' });

// Relaciones Student
Student.belongsTo(User, { foreignKey: 'id_user' });
Student.hasMany(StudentModule, { foreignKey: 'id_student' });
Student.hasMany(StudentPracticeAssignment, { foreignKey: 'id_student' });

// Relaciones Teacher
Teacher.belongsTo(User, { foreignKey: 'id_user' });

// Relaciones Admin
Admin.belongsTo(User, { foreignKey: 'id_user' });

// Relaciones Company
Company.hasMany(CompanyContact, { foreignKey: 'id_company' });
Company.hasMany(CompanyAddress, { foreignKey: 'id_company' });
Company.hasMany(Agreement, { foreignKey: 'id_company' });
Company.hasMany(StudentPracticeAssignment, { foreignKey: 'id_company' });

// Relaciones CompanyContact
CompanyContact.belongsTo(User, { foreignKey: 'id_user' });
CompanyContact.belongsTo(Company, { foreignKey: 'id_company' });

// Relaciones CompanyAddress
CompanyAddress.belongsTo(Company, { foreignKey: 'id_company' });

// Relaciones Agreement
Agreement.belongsTo(Company, { foreignKey: 'id_company' });

// Relaciones StudentModule
StudentModule.belongsTo(Student, { foreignKey: 'id_student' });
StudentModule.belongsTo(Module, { foreignKey: 'id_module' });

// Relaciones StudentPracticeAssignment
StudentPracticeAssignment.belongsTo(Student, { foreignKey: 'id_student' });
StudentPracticeAssignment.belongsTo(Company, { foreignKey: 'id_company' });
StudentPracticeAssignment.belongsTo(Module, { foreignKey: 'id_module' });

// Relaciones Module
Module.hasMany(StudentModule, { foreignKey: 'id_module' });
Module.hasMany(StudentPracticeAssignment, { foreignKey: 'id_module' });

// Relaciones Session
Session.belongsTo(User, { foreignKey: 'id_user' });

export {
  sequelize,
  User,
  Role,
  Student,
  Teacher,
  Admin,
  Company,
  CompanyContact,
  CompanyAddress,
  Agreement,
  StudentModule,
  StudentPracticeAssignment,
  Module,
  Session
};
