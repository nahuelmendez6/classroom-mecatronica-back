import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const GroupStudent = sequelize.define("GroupStudent", {
    id_group: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'group',
        key: 'id_group'
      }
    },
    id_student: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'students',
        key: 'id_student'
      }
    }
  }, {
    tableName: 'group_student',
    timestamps: false
  });


export default GroupStudent;