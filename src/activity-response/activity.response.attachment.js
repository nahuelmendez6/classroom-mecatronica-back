// models/activity_response_attachment.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const ActivityResponseAttachment = sequelize.define('ActivityResponseAttachment', {
  id_attachment: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_response: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  file_path: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'activity_response_attachment',
  timestamps: false
});

export default ActivityResponseAttachment;
