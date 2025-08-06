import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const LogEntry = sequelize.define('LogEntry', {
    id_log_entry: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_student: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_module: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    entry_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    }, 
}, {
        tableName: 'log_entry',
        timestamps: false,
    })

export default LogEntry;