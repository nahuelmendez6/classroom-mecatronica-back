import sequelize from '../config/sequalize.js';

// ========================
// MODELOS DE USUARIO
// ========================
import User from './user.model.js';
import Role from './role.model.js';
import Student from '../student/student.model.js';
import Teacher from '../teacher/teacher.model.js';
import Admin from '../admin/admin.model.js';
import Company from './company.model.js';
import CompanyContact from './company.contact.model.js';
import CompanyAddress from './company.address.model.js';
import Session from './session.model.js';
import LoginAttempt from './login.attempt.model.js';

// ========================
// Acuerdo de estudiante
// ========================
import StudentAgreement from '../student/student.agreement.js';


// ========================
// ORGANIZACIÓN
// ========================
import Organization from '../organization/organization.model.js';
import OrganizationAddress from '../organization/organization.address.model.js';
import OrganizationContact from '../organization/organization.contact.model.js';
import OrganizationAgreement from '../organization/organization.agreement.model.js';
import Agreement from './agreement.model.js';

// ========================
// CURSOS Y MÓDULOS
// ========================
import Course from '../course/course.model.js';
import Module from '../modules/module.model.js';
import SubModule from '../modules/sub.module.model.js';
import ModuleTeacher from './module.teacher.model.js';
import LearningMaterial from './learning.material.js';
import StudentModule from './student_module.model.js';
import StudentPracticeAssignment from './student.practice.assignment.model.js';
import StudentCourse from '../student-course/student.course.model.js';
import TeacherCourse from '../teacher-course/teacher.course.model.js';
// ========================
// GRUPOS
// ========================
import Group from '../group/group.model.js';
import GroupStudent from '../group/group.student.model.js';

// ========================
// ACTIVIDADES
// ========================
import Activity from '../activity/activity.model.js';
import ActivityResponse from '../activity-response/activity.response.model.js';
import ActivityResponseAttachment from '../activity-response/activity.response.attachment.js';

// ========================
// BITÁCORA
// ========================
import LogEntry from '../log-entry/log.entry.model.js';
import LogEntryFile from '../log-entry/log.entry.file.js';
import Comment from '../log-entry/comment.model.js';

// ========================
// TAREAS
// ========================
import TaskType from './task.type.model.js';
import Task from './task.model.js';
import TaskProgress from './task.progress.model.js';
import TaskQuestionnaire from './task.questionnaire.model.js';
import TaskSubmission from './task.submission.model.js';
import QuestionType from './question.type.model.js';
import QuestionOption from './question.option.model.js';

// ========================
// CONSULTAS
// ========================
import Query from './query.model.js';
import QueryResponse from './query.response.model.js';

// ========================
// ASISTENCIAS
// ========================
import Attendance from '../attendance/attendance.model.js';

// ========================
// PRÁCTICAS
// ========================
import PracticeAssignment from '../practice/practice.assignment.model.js';

// ========================
// ========================
// RELACIONES
// ========================

// --- Usuarios ---
User.belongsTo(Role, { foreignKey: 'id_role' });
User.hasOne(Student, { foreignKey: 'id_user', as: 'student' });
User.hasOne(Teacher, { foreignKey: 'id_user' });
User.hasOne(Admin, { foreignKey: 'id_user' });
User.hasOne(CompanyContact, { foreignKey: 'id_user' });
User.hasMany(Session, { foreignKey: 'id_user' });
User.hasMany(LoginAttempt, { foreignKey: 'id_user' });

Student.belongsTo(User, { foreignKey: 'id_user', as: 'user' });
Student.hasMany(PracticeAssignment, { foreignKey: 'id_student' });
Student.hasMany(StudentPracticeAssignment, { foreignKey: 'id_student', onDelete: 'CASCADE' });
Student.hasMany(LogEntry, { foreignKey: 'id_student' });
Student.hasMany(StudentAgreement, { foreignKey: 'id_student', as: 'agreements'});

Teacher.belongsTo(User, { foreignKey: 'id_user' });
Teacher.hasMany(Activity, { foreignKey: 'id_teacher' });
Teacher.hasMany(ModuleTeacher, { foreignKey: 'id_teacher', as: 'moduleTeachers' });
Teacher.hasMany(TeacherCourse, { foreignKey: 'id_teacher' });

Admin.belongsTo(User, { foreignKey: 'id_user' });

// --- Organización ---
Organization.hasMany(OrganizationContact, { foreignKey: 'id_company', as: 'contacts' });
Organization.hasMany(OrganizationAddress, { foreignKey: 'id_organization' });
Organization.hasMany(Agreement, { foreignKey: 'id_organization' });
Organization.hasMany(PracticeAssignment, { foreignKey: 'id_organization' });
Organization.hasMany(Group, { foreignKey: 'id_organization' });
Organization.hasOne(OrganizationAgreement, { foreignKey: 'id_company' });

OrganizationAgreement.belongsTo(Organization, { foreignKey: 'id_company' });

OrganizationContact.belongsTo(User, { foreignKey: 'id_user' });
OrganizationContact.belongsTo(Organization, { foreignKey: 'id_company', as: 'organization' });

OrganizationAddress.belongsTo(Organization, { foreignKey: 'id_organization' });
Agreement.belongsTo(Organization, { foreignKey: 'id_organization' });

StudentAgreement.belongsTo(Student, { foreignKey: 'id_student', as: 'student'});

// --- Cursos y Módulos ---
Course.hasMany(Module, { foreignKey: 'id_course', as: 'modulos' });
Course.hasMany(Activity, { foreignKey: 'course_id' });
Module.belongsTo(Course, { foreignKey: 'id_course' });

Module.hasMany(SubModule, { foreignKey: 'id_module', as: 'submodules', onDelete: 'CASCADE' });
SubModule.belongsTo(Module, { foreignKey: 'id_module', as: 'module', onDelete: 'CASCADE' });

Module.hasMany(StudentModule, { foreignKey: 'id_module' });
StudentModule.belongsTo(Module, { foreignKey: 'id_module' });

Module.hasMany(StudentPracticeAssignment, { foreignKey: 'id_module' });
Module.hasMany(Activity, { foreignKey: 'id_module' });
Module.hasMany(LogEntry, { foreignKey: 'id_module' });
Module.hasMany(ModuleTeacher, { foreignKey: 'id_module', as: 'moduleTeachers' });
ModuleTeacher.belongsTo(Module, { foreignKey: 'id_module', as: 'module' });

LearningMaterial.belongsTo(Module, { foreignKey: 'id_module', targetKey: 'id_module', onDelete: 'CASCADE' });

// --- Estudiantes y Cursos ---
Course.belongsToMany(Student, { through: StudentCourse, foreignKey: 'id_course', otherKey: 'id_student' });
Student.belongsToMany(Course, { through: StudentCourse, foreignKey: 'id_student', otherKey: 'id_course' });
StudentCourse.belongsTo(Student, { foreignKey: 'id_student', as: 'student' });
Student.belongsTo(User, { foreignKey: 'id_user', as: 'user_student' });

// --- Teachers y Cursos ---
Teacher.belongsToMany(Course, { through: TeacherCourse, foreignKey: 'id_teacher', otherKey: 'id_course' });
Course.belongsToMany(Teacher, { through: TeacherCourse, foreignKey: 'id_course', otherKey: 'id_teacher', as: 'teachers' });
TeacherCourse.belongsTo(Teacher, { foreignKey: 'id_teacher' });
TeacherCourse.belongsTo(Course, { foreignKey: 'id_course', as: 'course' });
Course.hasMany(TeacherCourse, { foreignKey: 'id_course' });

// --- Grupos ---
Group.belongsTo(Course, { foreignKey: 'id_course' });
Group.belongsTo(Organization, { foreignKey: 'id_organization' });
Group.hasMany(PracticeAssignment, { foreignKey: 'id_group', as: 'practice_assignments' });

Group.belongsToMany(Student, { through: GroupStudent, foreignKey: 'id_group', otherKey: 'id_student' });
Student.belongsToMany(Group, { through: GroupStudent, foreignKey: 'id_student', otherKey: 'id_group' });

GroupStudent.belongsTo(Student, { foreignKey: 'id_student' });
GroupStudent.belongsTo(Group, { foreignKey: 'id_group' });

// --- Actividades ---
Activity.belongsTo(Course, { foreignKey: 'course_id' });
Activity.belongsTo(Teacher, { foreignKey: 'id_teacher' });
Activity.belongsTo(Module, { foreignKey: 'id_module', as: 'module' });
Activity.hasMany(ActivityResponse, { foreignKey: 'id_activity', as: 'responses' });

ActivityResponse.belongsTo(Activity, { foreignKey: 'id_activity', as: 'activity', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
ActivityResponse.belongsTo(Student, { foreignKey: 'id_student', as: 'student', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
ActivityResponse.hasMany(ActivityResponseAttachment, { foreignKey: 'id_response', as: 'attachments', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// --- Bitácora ---
LogEntry.belongsTo(Student, { foreignKey: 'id_student' });
LogEntry.belongsTo(Module, { foreignKey: 'id_module' });
LogEntry.hasMany(LogEntryFile, { foreignKey: 'id_log_entry' });
LogEntryFile.belongsTo(LogEntry, { foreignKey: 'id_log_entry' });

LogEntry.hasMany(Comment, { foreignKey: 'id_log_entry' });
Comment.belongsTo(LogEntry, { foreignKey: 'id_log_entry' });

// --- Tareas ---
Task.belongsTo(Module, { foreignKey: 'id_module' });
Task.belongsTo(TaskType, { foreignKey: 'id_task_type' });
Task.hasMany(TaskProgress, { foreignKey: 'id_task' });
Task.hasMany(TaskQuestionnaire, { foreignKey: 'id_task' });
Task.hasMany(TaskSubmission, { foreignKey: 'id_task' });

TaskProgress.belongsTo(Task, { foreignKey: 'id_task' });
TaskProgress.belongsTo(Student, { foreignKey: 'id_student' });

TaskQuestionnaire.belongsTo(Task, { foreignKey: 'id_task' });
TaskQuestionnaire.belongsTo(QuestionType, { foreignKey: 'id_question_type' });

QuestionOption.belongsTo(TaskQuestionnaire, { foreignKey: 'id_question' });

TaskSubmission.belongsTo(Task, { foreignKey: 'id_task' });
TaskSubmission.belongsTo(Student, { foreignKey: 'id_student' });

TaskType.hasMany(Task, { foreignKey: 'id_task_type' });

// --- Consultas ---
Query.hasMany(QueryResponse, { foreignKey: 'id_query' });
QueryResponse.belongsTo(Query, { foreignKey: 'id_query' });
QueryResponse.belongsTo(Teacher, { foreignKey: 'id_teacher' });

// --- Asistencias ---
Attendance.belongsTo(Student, { foreignKey: "id_student", as: "student", onDelete: "CASCADE" });
Attendance.belongsTo(Organization, { foreignKey: 'id_organization', as: 'organization' });
Student.hasMany(Attendance, { foreignKey: "id_student", as: "attendances" });
Organization.hasMany(Attendance, { foreignKey: 'id_organization', as: 'attendances' });

// --- Prácticas ---
PracticeAssignment.belongsTo(Student, { foreignKey: 'id_student', as: 'student' });
PracticeAssignment.belongsTo(Group, { foreignKey: 'id_group', as: 'group' });
PracticeAssignment.belongsTo(Organization, { foreignKey: 'id_organization', as: 'organization' });

// --- Sesiones y login ---
Session.belongsTo(User, { foreignKey: 'id_user' });
LoginAttempt.belongsTo(User, { foreignKey: 'id_user' });

// --- Exportaciones ---
export {
  sequelize,
  User, Role, Student, Teacher, Admin, Company,
  CompanyContact, CompanyAddress, Agreement,
  StudentModule, StudentPracticeAssignment,
  Module, Session, Course, LearningMaterial,
  ModuleTeacher, LoginAttempt, SubModule, StudentCourse,
  TeacherCourse, Group, GroupStudent, TaskType, Task,
  TaskProgress, TaskQuestionnaire, TaskSubmission,
  QuestionType, QuestionOption, Query, QueryResponse,
  Attendance, StudentAgreement
};
