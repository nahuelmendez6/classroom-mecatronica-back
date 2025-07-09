import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const TeacherCourse = sequelize.define('TeacherCourse', {
  id_teacher: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'teacher',
      key: 'id_teacher',
    },
    onDelete: 'CASCADE'
  },
  id_course: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'course',
      key: 'id_course',
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'teacher_course',
  timestamps: false
});

export default TeacherCourse;
