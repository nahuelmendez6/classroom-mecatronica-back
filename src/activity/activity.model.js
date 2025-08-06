import { DataTypes } from "sequelize";
import sequelize from '../config/sequalize.js';

const Activity = sequelize.define('Activity', {
  id_activity: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  attachments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'course',
      key: 'id_course',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  id_teacher: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'teacher',
      key: 'id_teacher',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  id_module: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'module',
      key: 'id_module',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
}, {
  tableName: 'activity',
  timestamps: false,
});

export default Activity;
