import bcrypt from 'bcryptjs/dist/bcrypt.js';
import Teacher from './teacher.model.js';
import User from '../models/user.model.js'; // Import the User model
import Role from '../models/role.model.js';
import sequelize from '../config/sequalize.js';
import Course from '../models/Course.js';
import TeacherCourse from '../models/teacher.course.model.js';
import Company from '../models/company.model.js'; // Added
import Group from '../models/group.model.js'; // Added
import Student from '../models/student.model.js';
import Module from '../models/module.model.js'; // Added
import { AppError, NotFoundError } from '../utils/errorHandler.js';
import { Op } from 'sequelize';

import * as TeacherRepo from './teacher.repository.js';

export async function getTeacherCourses(userId) {

    const teacher = await TeacherRepo.findByUserId(userId);
    if (!teacher) throw new NotFoundError('Teacher');
    
    return await TeacherRepo.findCoursesByTeacher(teacher.id_teacher);

}

export async function getTeacherGroups(userId) {

    const teacher = await TeacherRepo.findByUserId(userId);
    if (!teacher) throw new NotFoundError('Teacher');

    const courses = await TeacherCourse.findAll({
        where: { id_teacher: teacher.id_teacher },
        attributes: ['id_course']
    });

    const courseIds = courses.map(tc => tc.id_course);

    if (!courseIds.length) return [];

    return await TeacherRepo.findGroupsByTeacherCourses(courseIds);

}


export async function getTeacherModules(userId) {

    const teacher = await TeacherRepo.findByUserId(userId);
    if (!teacher) throw new NotFoundError('Teacher');

    const courses = await TeacherCourse.findAll({
        where: { id_teacher: teacher.id_teacher },
        attributes: ['id_course']
    });

    const courseIds = courses.map(tc => tc.id_course);

    if (!courseIds.length) return [];

    return await TeacherRepo.findModulesByCourses(courseIds);
}

export async function getAllTeachers() {
    return await TeacherRepo.findAll();
}

export async function createTeacherWithUser(techaerData) {
    const t = await sequelize.transaction();
    try {
        const {
            email,
            password,
            name,
            lastname,
            dni,
            phone_number,
            observations
        } = techaerData;

        const finalPassword = password || dni;
    
        const teacherRole = await Role.findOne({ where: { name: 'Profesor' } }, { transaction: t });
        if (!teacherRole) {
            throw new AppError("The 'Profesor' role is not configured in the system.", 500);
        }

        const hashedPassword = await bcrypt.hash(finalPassword, 10);
        
        /** Primero creamos el usuario */
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            lastname,
            dni,
            phone_number,
            id_role: teacherRole.id_role
        }, { transaction: t });
        
        /** con el usuario creado agregamos profesor */
        const newTeacher = await Teacher.create({
            id_user: newUser.id_user,
            name,
            lastname,
            phone_number,
            observations
        }, { transaction: t });

        await t.commit();
        return newTeacher;  
    } catch (error) {
        await t.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new AppError('Email or DNI already registered.', 409);
        }
        console.error("Error in createTeacherWithUser:", error);
        throw new AppError('Internal server error while creating the teacher.', 500);
    }
}

