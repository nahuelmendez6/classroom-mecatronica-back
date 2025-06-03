import sequelize from '../config/sequalize.js';
import User from './user.model.js';
import Role from './role.model.js';
import Student from './student.model.js';
import Teacher from './teacher.model.js';
import Admin from './admin.model.js';
import Company from './company.model.js';
import Course from './Course.js';
import CompanyContact from './company.contact.model.js';
import CompanyAddress from './company.address.model.js';
import Agreement from './agreement.model.js';
import StudentModule from './student_module.model.js';
import StudentPracticeAssignment from './student.practice.assignment.model.js';
import Module from './module.model.js';
import Session from './session.model.js';
import LearningMaterial from './learning.material.js';
import ModuleTeacher from './module.teacher.model.js';
import LoginAttempt from './login.attempt.model.js';

// RELACIONES (sólo después de importar todo)

User.belongsTo(Role, { foreignKey: 'id_role' });
User.hasOne(Student, { foreignKey: 'id_user' });
User.hasOne(Teacher, { foreignKey: 'id_user' });
User.hasOne(Admin, { foreignKey: 'id_user' });
User.hasOne(CompanyContact, { foreignKey: 'id_user' });
User.hasMany(Session, { foreignKey: 'id_user' });
User.hasMany(LoginAttempt, { foreignKey: 'id_user' });

Student.belongsTo(User, { foreignKey: 'id_user' });
Student.hasMany(StudentModule, { foreignKey: 'id_student' });
Student.hasMany(StudentPracticeAssignment, { foreignKey: 'id_student' });

Teacher.belongsTo(User, { foreignKey: 'id_user' });

Admin.belongsTo(User, { foreignKey: 'id_user' });

Company.hasMany(CompanyContact, { foreignKey: 'id_company' });
Company.hasMany(CompanyAddress, { foreignKey: 'id_company' });
Company.hasMany(Agreement, { foreignKey: 'id_company' });
Company.hasMany(StudentPracticeAssignment, { foreignKey: 'id_company' });

CompanyContact.belongsTo(User, { foreignKey: 'id_user' });
CompanyContact.belongsTo(Company, { foreignKey: 'id_company' });

CompanyAddress.belongsTo(Company, { foreignKey: 'id_company' });

Agreement.belongsTo(Company, { foreignKey: 'id_company' });

StudentModule.belongsTo(Student, { foreignKey: 'id_student' });
StudentModule.belongsTo(Module, { foreignKey: 'id_module' });

StudentPracticeAssignment.belongsTo(Student, { foreignKey: 'id_student' });
StudentPracticeAssignment.belongsTo(Company, { foreignKey: 'id_company' });
StudentPracticeAssignment.belongsTo(Module, { foreignKey: 'id_module' });

Module.hasMany(StudentModule, { foreignKey: 'id_module' });
Module.hasMany(StudentPracticeAssignment, { foreignKey: 'id_module' });

Session.belongsTo(User, { foreignKey: 'id_user' });
LoginAttempt.belongsTo(User, { foreignKey: 'id_user' });

Course.hasMany(Module, { foreignKey: 'id_course' });
Module.belongsTo(Course, { foreignKey: 'id_course' });

Module.hasMany(StudentModule, { foreignKey: 'id_module' });
StudentModule.belongsTo(Module, { foreignKey: 'id_module' });

Module.hasMany(ModuleTeacher, { foreignKey: 'id_module' });
ModuleTeacher.belongsTo(Module, { foreignKey: 'id_module' });

Course.belongsToMany(Student, {
  through: 'student_course',
  foreignKey: 'id_course',
  otherKey: 'id_student'
});

Student.belongsToMany(Course, {
  through: 'student_course',
  foreignKey: 'id_student',
  otherKey: 'id_course'
});

LearningMaterial.belongsTo(Module, {
  foreignKey: 'id_module',
  targetKey: 'id_module',
  onDelete: 'CASCADE',
});

Student.hasMany(StudentPracticeAssignment, { foreignKey: 'id_student', onDelete: 'CASCADE' });
Company.hasMany(StudentPracticeAssignment, { foreignKey: 'id_company', onDelete: 'CASCADE' });

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
  Session,
  Course,
  LearningMaterial,
  ModuleTeacher,
  LoginAttempt
};
