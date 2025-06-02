import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js'; // Asegurate que la ruta y nombre estén bien

const StudentModule = sequelize.define('student_module', {
  id_student: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'student',
      key: 'id_student'
    },
    onDelete: 'CASCADE'
  },
  id_module: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'module',
      key: 'id_module'
    },
    onDelete: 'CASCADE'
  },
  assigned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('Asignado','En Progreso','Completado'),
    defaultValue: 'Asignado'
  }
}, {
  tableName: 'student_module',
  timestamps: false,
});

export default StudentModule;
