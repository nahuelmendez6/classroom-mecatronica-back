import TaskService from '../services/task.service.js';
import { AppError } from '../utils/errorHandler.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseHandler.js';

class TaskController {
  static async createTask(req, res) {
    try {
      const task = await TaskService.createTask(req.body);
      sendSuccessResponse(res, task, 201);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  }

  static async getAllTasks(req, res) {
    try {
      const tasks = await TaskService.getAllTasks();
      sendSuccessResponse(res, tasks);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  }

  static async getTaskById(req, res) {
    try {
      const task = await TaskService.getTaskById(req.params.id);
      sendSuccessResponse(res, task);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  }

  static async updateTask(req, res) {
    try {
      const task = await TaskService.updateTask(req.params.id, req.body);
      sendSuccessResponse(res, task);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  }

  static async deleteTask(req, res) {
    try {
      const result = await TaskService.deleteTask(req.params.id);
      sendSuccessResponse(res, result);
    } catch (error) {
      sendErrorResponse(res, error);
    }
  }
}

export default TaskController;