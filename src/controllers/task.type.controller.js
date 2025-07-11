import TaskTypeService from '../services/task.type.service.js';
import { AppError } from '../utils/errorHandler.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

class TaskTypeController {
  static async getAllTaskTypes(req, res) {
    try {
      const taskTypes = await TaskTypeService.getAllTaskypes();
      sendSuccess(res, 200, 'Task types retrieved successfully', taskTypes);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }
}

export default TaskTypeController;