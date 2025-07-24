import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const PracticeAssignment = sequelize.define('PracticeAssignment', {
  id_practice: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_student: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_group: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_organization: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  required_hours: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  objectives: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'practice_assignment',
  timestamps: false
});

export default PracticeAssignment;
