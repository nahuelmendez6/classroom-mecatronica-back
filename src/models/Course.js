// models/course.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequalize.js'; // tu instancia Sequelize

class Course extends Model {}

Course.init({
  id_course: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  course: DataTypes.STRING,
  // start_date: DataTypes.DATEONLY,
  // end_date: DataTypes.DATEONLY,
  status: DataTypes.STRING,
  description: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'Course',
  tableName: 'course',
  timestamps: false
});

export default Course;
