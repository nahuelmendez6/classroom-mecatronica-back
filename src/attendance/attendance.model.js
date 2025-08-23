import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const Attendance = sequelize.define(
  'Attendance',
  {
    id_attendance: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_student: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_organization: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attendance_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    entry_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    exit_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'attendance', // ✅ Ahora sí está en el segundo argumento
    timestamps: false,
    underscored: true,
  }
);
export default Attendance;