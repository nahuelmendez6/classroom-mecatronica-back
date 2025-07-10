import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';
import Task from './task.model.js';
import Student from './student.model.js';

const TaskProgress = sequelize.define('TaskProgress', {
  id_progress: {
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
  progress_status: {
    type: DataTypes.ENUM('En progreso', 'Completada', 'Pendiente', 'En revisión'),
    allowNull: false,
  },
  progress_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0.00,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'task_progress',
  timestamps: false,
});

export default TaskProgress;