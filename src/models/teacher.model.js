import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';
import User from './user.model.js';

const Teacher = sequelize.define('Teacher', {
  id_teacher: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id_user'
    },
    onDelete: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'teacher',
  timestamps: false
});

Teacher.belongsTo(User, { foreignKey: 'id_user' });
User.hasOne(Teacher, { foreignKey: 'id_user' });

export default Teacher;