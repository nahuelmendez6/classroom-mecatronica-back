import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';  // ajusta si el path o nombre es distinto

const Role = sequelize.define('Role', {
  id_role: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'role',
  timestamps: false, // como usás created_at manual, no timestamps automáticos
});

export default Role;
