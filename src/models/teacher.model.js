import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';
// import User from './user.model.js'; // Import the User model

const Teacher = sequelize.define('Teacher', {
  id_teacher: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  },
  is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
}, {
  tableName: 'teacher',
  timestamps: false
});

// Define association here as well to ensure it's always loaded
// Teacher.belongsTo(User, { foreignKey: 'id_user' });

export default Teacher;