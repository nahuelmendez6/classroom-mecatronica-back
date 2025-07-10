import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';
import Student from './student.model.js';
import Module from './module.model.js';
import TaskType from './task.type.model.js';

const Task = sequelize.define('Task', {
  id_task: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  id_student: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: 'id_student',
    },
  },
  id_module: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Module,
      key: 'id_module',
    },
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  attachment_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  id_task_type: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: TaskType,
      key: 'id_task_type',
    },
  },
}, {
  tableName: 'task',
  timestamps: false,
});

export default Task;