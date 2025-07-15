import Teacher from './teacher.model.js';
import Course from '../models/Course.js';
import TeacherCourse from '../models/teacher.course.model.js';
import Group from '../models/group.model.js';
import Module from '../models/module.model.js';
import { Op } from 'sequelize';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';
import Student from '../models/student.model.js';


export async function findByUserId(id_user) {
    return await Teacher.findOne({
        where: { id_user }, 
    });
}

export async function findCoursesByTeacher(teacherId) {
  return await Course.findAll({
    include: {
      model: Teacher,
      through: TeacherCourse,
      as: 'teachers',
      where: { id_teacher: teacherId },
      attributes: []
    },
    attributes: ['id_course', 'course']
  });
}

export async function findGroupsByTeacherCourses(coursesIds) {
    return await Group.findAll({
        where: {
            id_course: {
                [Op.in]: coursesIds
            }
        },
        include: [
            { model: Course, attributes: ['course']},
            { model: Company, attributes: ['name']},
            { model: Student, through: 'group_student'}
        ]
    });
}

export async function findModulesByCourses(coursesIds) {
    return await Module.findAll({
        id_course: {
            [Op.in]: coursesIds
        },
        include: [
            { model: Course, attributes: ['course'] },
        ]
    });
}

export async function findAll() {
    return await Teacher.findAll({
        include: [{
            model: User,
            attributes: ['email']
        }]
    });
}