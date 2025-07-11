import Task from '../models/task.model.js';
import TaskProgress from '../models/task.progress.model.js';
import TaskSubmission from '../models/task.submission.model.js';
import TaskType from '../models/task.type.model.js';
import Student from '../models/student.model.js';
import Module from '../models/module.model.js';
import { AppError, NotFoundError } from '../utils/errorHandler.js';

class TaskService {
  static async createTask(taskData) {
    try {
      const task = await Task.create(taskData);
      return task;
    } catch (error) {
      throw new AppError(`Error creating task: ${error.message}`, 500);
    }
  }

  static async getAllTasks() {
    try {
      const tasks = await Task.findAll({
        include: [
          { model: Module, attributes: ['id_module', 'name'] },
          { model: TaskType, attributes: ['id_task_type', 'name'] },
        ],
      });
      return tasks;
    } catch (error) {
      throw new AppError(`Error fetching tasks: ${error.message}`, 500);
    }
  }

  static async getTaskById(id) {
    try {
      const task = await Task.findByPk(id, {
        include: [
          { model: Module, attributes: ['id_module', 'name'] },
          { model: TaskType, attributes: ['id_task_type', 'name'] },
          { model: TaskProgress },
          { model: TaskSubmission },
        ],
      });
      if (!task) {
        throw new NotFoundError('Task');
      }
      return task;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError(`Error fetching task by ID: ${error.message}`, 500);
    }
  }

  static async updateTask(id, taskData) {
    try {
      const task = await Task.findByPk(id);
      if (!task) {
        throw new NotFoundError('Task');
      }
      await task.update(taskData);
      return task;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError(`Error updating task: ${error.message}`, 500);
    }
  }

  static async deleteTask(id) {
    try {
      const task = await Task.findByPk(id);
      if (!task) {
        throw new NotFoundError('Task');
      }
      await task.destroy();
      return { message: 'Task deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError(`Error deleting task: ${error.message}`, 500);
    }
  }
}

export default TaskService;