import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const Group = sequelize.define("Group", {
    id_group: {
        type: DataTypes.INTEGER,
        autoIncrement: true,    
        primaryKey: true,
    },
    group_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id_course: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id_course'
      }
    },id_company: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'company',
        key: 'id_company'
      }
    }
  }, {
    tableName: 'group',
    timestamps: false
  });


export default Group;