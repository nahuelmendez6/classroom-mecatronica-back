// src/models/LearningMaterial.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';
// import Module from './module.model.js'; // para la FK

const LearningMaterial = sequelize.define('LearningMaterial', {
  id_material: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  id_module: {
    type: DataTypes.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
  },
  material_type: {
    type: DataTypes.ENUM('PDF', 'Video', 'Audio', 'Presentación', 'Otro'),
    allowNull: false,
  },
  file_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tags: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  uploaded_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'learning_material',
  timestamps: false,
});



export default LearningMaterial;
