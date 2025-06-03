// src/models/module.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const Module = sequelize.define('Module', {
  id_module: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  duration: DataTypes.INTEGER,
  icon_url: DataTypes.STRING,
  id_course: DataTypes.INTEGER,
}, {
  tableName: 'module',
  timestamps: false,
});

export default Module;
