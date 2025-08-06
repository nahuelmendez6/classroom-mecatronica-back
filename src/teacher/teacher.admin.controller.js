import { validationResult } from "express-validator";
import { createTeacherWithUser, 
    getAllTeachers, 
    // getTeacherById, 
    // restoreTeacher, 
    // softDeleteTeacher, 
    
 } from "./teacher.service.js";

import { updateTeacher } from './teacher.repository.js';
import { sendSuccess, sendError, sendValidationError } from "../utils/responseHandler.js";
import { asyncHandler } from "../utils/errorHandler.js";

class TeacherAdminController {

    static createWithUser = asyncHandler(async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }

        const teacher = await createTeacherWithUser(req.body);
        sendSuccess(res, 201, 'Teacher created successfully with user', teacher);

    })

    // static create = asyncHandler(async (req, res) => {

    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return sendValidationError(res, errors.array());
    //     }

    //     const teacher = await createTeacher(req.body);
    //     sendSuccess(res, 201, 'Teacher created successfully', teacher);

    // })

    static getAll = asyncHandler(async (req, res) => {
        const teachers = await getAllTeachers();
        const teachersWithEmail = teachers.map((teacher) => ({
        ...teacher.toJSON(),
        email: teacher.User ? teacher.User.email : null
        }));
        sendSuccess(res, 200, 'Teachers retrieved successfully', teachersWithEmail);
    });

    // static getById = asyncHandler(async (req, res) => {
    //     const teacher = await getTeacherById(req.params.id);
    //     sendSuccess(res, 200, 'Teacher retrieved successfully', teacher);
    // });

    // static restore = asyncHandler(async (req, res) => {
    //     await restoreTeacher(req.params.id);
    //     sendSuccess(res, 200, 'Teacher restored successfully');
    // });

    // static softDelete = asyncHandler(async (req, res) => {
    //     const { id } = req.params;
    //     await softDeleteTeacher(id);
    //     sendSuccess(res, 200, 'Teacher soft deleted successfully');
    // });

    static update = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const teacherData = req.body;

        const updatedTeacher = await updateTeacher(id, teacherData);
        sendSuccess(res, 200, 'Teacher updated successfully', updatedTeacher);
    });

}

export default TeacherAdminController;