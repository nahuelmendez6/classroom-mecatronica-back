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
import SubModule from './sub.module.model.js';
import StudentCourse from './student.course.js';
import TeacherCourse from './teacher.course.model.js';
import Group from './group.model.js';
import GroupStudent from './group.student.model.js';
import TaskType from './task.type.model.js';
import Task from './task.model.js';
import TaskProgress from './task.progress.model.js';
import TaskQuestionnaire from './task.questionnaire.model.js';
import TaskSubmission from './task.submission.model.js';
import QuestionType from './question.type.model.js';
import QuestionOption from './question.option.model.js';
import Query from './query.model.js';
import QueryResponse from './query.response.model.js';

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

Course.hasMany(Module, { foreignKey: 'id_course', as: 'modulos' });
Module.belongsTo(Course, { foreignKey: 'id_course' });
Module.hasMany(SubModule, {
  foreignKey: 'id_module',
  as: 'submodules',
  onDelete: 'CASCADE'
});

SubModule.belongsTo(Module, { 
  foreignKey: 'id_module',
  as: 'module',
  onDelete: 'CASCADE'
});

Module.hasMany(StudentModule, { foreignKey: 'id_module' });
StudentModule.belongsTo(Module, { foreignKey: 'id_module' });

Module.hasMany(ModuleTeacher, { foreignKey: 'id_module', as: 'moduleTeachers' });
ModuleTeacher.belongsTo(Module, { foreignKey: 'id_module', as: 'module'  });
Teacher.hasMany(ModuleTeacher, { foreignKey: 'id_teacher', as: 'moduleTeachers' });
ModuleTeacher.belongsTo(Teacher, { foreignKey: 'id_teacher', as: 'teacher' });

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


Student.belongsToMany(Course, {
  through: StudentCourse,
  foreignKey: 'id_student',
  otherKey: 'id_course'
});

Course.belongsToMany(Student, {
  through: StudentCourse,
  foreignKey: 'id_course',
  otherKey: 'id_student'
});

Teacher.belongsToMany(Course, { through: TeacherCourse, foreignKey: 'id_teacher', otherKey: 'id_course' });
Course.belongsToMany(Teacher, { through: TeacherCourse, foreignKey: 'id_course', otherKey: 'id_teacher', as: 'teachers' });

Group.belongsTo(Course, { foreignKey: 'id_course' });
Group.belongsTo(Company, { foreignKey: 'id_company' });

Group.belongsToMany(Student, { through: GroupStudent, foreignKey: 'id_group', otherKey: 'id_student' });
Student.belongsToMany(Group, { through: GroupStudent, foreignKey: 'id_student', otherKey: 'id_group' });

// Task Relationships

Task.belongsTo(Module, { foreignKey: 'id_module' });
Task.belongsTo(TaskType, { foreignKey: 'id_task_type' });
Task.hasMany(TaskProgress, { foreignKey: 'id_task' });
Task.hasMany(TaskQuestionnaire, { foreignKey: 'id_task' });
Task.hasMany(TaskSubmission, { foreignKey: 'id_task' });

// TaskProgress Relationships
TaskProgress.belongsTo(Task, { foreignKey: 'id_task' });
TaskProgress.belongsTo(Student, { foreignKey: 'id_student' });

// TaskQuestionnaire Relationships
TaskQuestionnaire.belongsTo(Task, { foreignKey: 'id_task' });
TaskQuestionnaire.belongsTo(QuestionType, { foreignKey: 'id_question_type' }); // Assuming QuestionType model exists

// QuestionOption Relationships
QuestionOption.belongsTo(TaskQuestionnaire, { foreignKey: 'id_question' });

// Query Relationships
Query.hasMany(QueryResponse, { foreignKey: 'id_query' });

// QueryResponse Relationships
QueryResponse.belongsTo(Query, { foreignKey: 'id_query' });
QueryResponse.belongsTo(Teacher, { foreignKey: 'id_teacher' });


// TaskSubmission Relationships
TaskSubmission.belongsTo(Task, { foreignKey: 'id_task' });
TaskSubmission.belongsTo(Student, { foreignKey: 'id_student' });

// TaskType Relationships
TaskType.hasMany(Task, { foreignKey: 'id_task_type' });

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
  LoginAttempt,
  SubModule,
  StudentCourse,
  TeacherCourse,
  Group,
  GroupStudent,
  TaskType,
  Task,
  TaskProgress,
  TaskQuestionnaire,
  TaskSubmission,
  QuestionType,
  QuestionOption,
  Query,
  QueryResponse
};
