import { validationResult } from 'express-validator';
import CourseService from '../services/course.service.js';
import { sendSuccess, sendError, sendValidationError } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/errorHandler.js';

export const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await CourseService.getAllCourses();
  sendSuccess(res, 200, 'Cursos obtenidos correctamente', courses);
});

export const getCourseById = asyncHandler(async (req, res) => {
  const course = await CourseService.getCourseById(req.params.id);
  sendSuccess(res, 200, 'Curso obtenido correctamente', course);
});

export const createCourse = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendValidationError(res, errors.array());
  }

  const newCourse = await CourseService.createCourse(req.body);
  sendSuccess(res, 201, 'Curso creado correctamente', newCourse);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendValidationError(res, errors.array());
  }

  const updatedCourse = await CourseService.updateCourse(req.params.id, req.body);
  sendSuccess(res, 200, 'Curso actualizado correctamente', updatedCourse);
});

export const deleteCourse = asyncHandler(async (req, res) => {
  await CourseService.deleteCourse(req.params.id);
  sendSuccess(res, 200, 'Curso eliminado correctamente');
});

export const enrollStudent = asyncHandler(async (req, res) => {
  const { courseId, studentId } = req.body;
  const result = await CourseService.enrollStudent(courseId, studentId);
  sendSuccess(res, 200, 'Estudiante inscrito correctamente', result);
});

export const getStudentsByCourse = asyncHandler(async (req, res) => {
  const students = await CourseService.getStudentsByCourse(req.params.courseId);
  sendSuccess(res, 200, 'Estudiantes del curso obtenidos correctamente', students);
});
