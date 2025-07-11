import Task from '../models/task.model.js';
import TaskProgress from '../models/task.progress.model.js';
import TaskSubmission from '../models/task.submission.model.js';
import TaskType from '../models/task.type.model.js';
import Student from '../models/student.model.js';
import Module from '../models/module.model.js';
import { AppError, NotFoundError } from '../utils/errorHandler.js';

class TaskTypeService {

    static async getAllTaskypes () {
        try {
            const taskTypes = await TaskType.findAll({
                attributes: ['id_task_type', 'name']
            });
            return taskTypes;
        } catch (error) {
            throw new AppError(`Error fetching task types: ${error.message}`, 500);
        }
    }
}

export default TaskTypeService;