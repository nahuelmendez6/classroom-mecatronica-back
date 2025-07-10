import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const TaskType = sequelize.define('TaskType', {
  id_task_type: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'task_type',
  timestamps: false,
});

export default TaskType;