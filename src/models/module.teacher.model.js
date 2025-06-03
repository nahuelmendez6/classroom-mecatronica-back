// src/models/module.teacher.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const ModuleTeacher = sequelize.define('ModuleTeacher', {
  id_module: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'module', // nombre de la tabla referenciada
      key: 'id_module',
    },
    onDelete: 'CASCADE',
  },
  id_teacher: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'teacher', // nombre de la tabla referenciada
      key: 'id_teacher',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'module_teacher',
  timestamps: false,
});

export default ModuleTeacher;
