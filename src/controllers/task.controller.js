import TaskService from '../services/task.service.js';
import { AppError } from '../utils/errorHandler.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

class TaskController {
  static async createTask(req, res) {
    try {
      const task = await TaskService.createTask(req.body);
      sendSuccess(res, 201, 'Task created successfully', task);
    } catch (error) {
      // extract status code and message, default to 500 if not provided
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  static async getAllTasks(req, res) {
    try {
      const tasks = await TaskService.getAllTasks();
      sendSuccess(res, 200, 'Tasks retrieved successfully', tasks);
    } catch (error) {
      // extract status code and message, default to 500 if not provided
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  static async getTaskById(req, res) {
    try {
      const task = await TaskService.getTaskById(req.params.id);
      sendSuccess(res, 200, 'Task retrieved successfully', task);
    } catch (error) {
     // extract status code and message, default to 500 if not provided
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  static async updateTask(req, res) {
    try {
      const task = await TaskService.updateTask(req.params.id, req.body);
      sendSuccess(res, 200, 'Task updated successfully', task);
    } catch (error) {
      // extract status code and message, default to 500 if not provided
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  static async deleteTask(req, res) {
    try {
      const result = await TaskService.deleteTask(req.params.id);
      sendSuccess(res, 200, 'Task deleted successfully', result);
    } catch (error) {
      // extract status code and message, default to 500 if not provided
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }
}

export default TaskController;