import { validationResult } from 'express-validator';
import GroupService from '../services/group.service.js';
import { sendSuccess, sendError, sendValidationError } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/errorHandler.js';

class GroupController {
    static async createGroup(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }
        try {
            const newGroup = await GroupService.createGroup(req.body);
            sendSuccess(res, 201, 'Grupo creado correctamente', newGroup);
        } catch (error) {
            sendError(res, error);
        }
    }

    static async getAllGroups(req, res) {
        try {
            const groups = await GroupService.getAllGroups();
            sendSuccess(res, 200, 'Grupos obtenidos correctamente', groups);
        } catch (error) {
            sendError(res, error);
        }
    }

    static async getGroupById(req, res) {
        try {
            const group = await GroupService.getGroupById(req.params.id);
            sendSuccess(res, 200, 'Grupo obtenido correctamente', group);
        } catch (error) {
            sendError(res, error);
        }
    }

    static async updateGroup(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }
        try {
            const updatedGroup = await GroupService.updateGroup(req.params.id, req.body);
            sendSuccess(res, 200, 'Grupo actualizado correctamente', updatedGroup);
        } catch (error) {
            sendError(res, error);
        }
    }

    static async deleteGroup(req, res) {
        try {
            await GroupService.deleteGroup(req.params.id);
            sendSuccess(res, 200, 'Grupo eliminado correctamente');
        } catch (error) {
            sendError(res, error);
        }
    }

    static async addStudentToGroup(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }
        try {
            const { groupId } = req.params;
            const { studentId } = req.body;
            const result = await GroupService.addStudentToGroup(groupId, studentId);
            sendSuccess(res, 200, result.message);
        } catch (error) {
            sendError(res, error);
        }
    }

    static async removeStudentFromGroup(req, res) {
        try {
            const { groupId, studentId } = req.params;
            const result = await GroupService.removeStudentFromGroup(groupId, studentId);
            sendSuccess(res, 200, result.message);
        } catch (error) {
            sendError(res, error);
        }
    }

    static async getStudentsInGroup(req, res) {
        try {
            const { groupId } = req.params;
            const students = await GroupService.getStudentsInGroup(groupId);
            sendSuccess(res, 200, 'Estudiantes del grupo obtenidos correctamente', students);
        } catch (error) {
            sendError(res, error);
        }
    }
}

export default GroupController;