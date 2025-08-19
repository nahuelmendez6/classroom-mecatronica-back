import Course from "./course.model.js";
import sequelize from '../config/sequalize.js';
import { AppError, NotFoundError } from '../utils/errorHandler.js';
// import { AppError, NotFoundError } from '../utils/errorHandler.js';


import * as CourseRepo from './course.repository.js';



export async function createCourse(courseData) {
    const { course, start_date, end_date, status, description } = courseData;

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (startDate >= endDate) {
        throw new AppError('La fecha de inicio debe ser anterior a la fecha de finalización', 400);
    }

    try {
        const newCourse = await CourseRepo.createCourse({
            course,
            start_date,
            end_date,
            status,
            description
        });
        return newCourse;
    } catch (error) {
        console.error('Error original en createCourse:', error);  // Logueamos el error real
        throw new AppError('Error al crear el curso', 500);
    }
}


export async function getAllCourses() {
    return await CourseRepo.findAllCourses();
}

export async function getCourseById(id) {
    const course = await CourseRepo.findById(id);
    if (!course) {
        throw new NotFoundError('Curso');
    }
    return course;
}

export async function updateCourse(id, courseData) {
    const { course, start_date, end_date, status, description, document_url } = courseData;

    const t = await sequelize.transaction();

    try {
        if (start_date && end_date) {
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            if (startDate >= endDate) {
                throw new AppError('La fecha de inicio debe ser anterior a la fecha de finalización', 400);
            }
        }

        const updatedCourse = await CourseRepo.updateCourse(id, {
            course,
            start_date,
            end_date,
            status,
            description,
            document_url
        }, t);

        await t.commit();
        return updatedCourse;
    } catch (error) {
        await t.rollback();
        console.error("Error real al actualizar curso:", error);
        throw new AppError('Error al actualizar el curso', 500);
    }
}

export async function deleteCourse(id) {
    const course = await CourseRepo.findById(id);
    if (!course) {
        throw new NotFoundError('Curso');
    }
    await CourseRepo.deleteCourse(id);
}

export async function findActiveCourses() {
    return await CourseRepo.findActiveCourses();
}

