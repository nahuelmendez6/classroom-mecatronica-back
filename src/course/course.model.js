import { DataTypes } from "sequelize";
import sequelize from '../config/sequalize.js';

const Course = sequelize.define('Course', {
    id_course: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    course: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    document_url: DataTypes.TEXT
}, {
  tableName: 'course',
  timestamps: false
});

export default Course;
