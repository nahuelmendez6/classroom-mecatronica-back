import { DataTypes } from "sequelize";
import sequelize from '../config/sequalize.js';

const ActivityResponse = sequelize.define('ActivityResponse', {
    id_response: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_activity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_student: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    submission_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    teacher_comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    grade: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    }
  }, {
    tableName: 'activity_response',
    timestamps: false
})

export default ActivityResponse;