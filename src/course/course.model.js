import { DataTypes } from "sequelize";
import sequelize from '../config/sequalize.js';

const Course = sequelize.define('Course', {
    id_course: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    course: DataTypes.STRING,   
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    status: DataTypes.STRING,
    description: DataTypes.TEXT,
    document_url: {
      type: DataTypes.TEXT,
    }
}, {
  tableName: 'course',
  timestamps: false
})

export default Course;