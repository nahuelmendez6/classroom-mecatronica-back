import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';
import Task from './task.model.js';
import Student from './student.model.js';

const TaskSubmission = sequelize.define('TaskSubmission', {
  id_submission: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_task: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Task,
      key: 'id_task',
    },
  },
  id_student: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: 'id_student',
    },
  },
  attachment_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  submitted_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'task_submission',
  timestamps: false,
});

export default TaskSubmission;