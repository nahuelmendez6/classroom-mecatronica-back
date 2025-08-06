import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const LogEntryFile = sequelize.define('LogEntryFile', {
  id_log_entry_file: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_log_entry: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  original_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  tableName: 'log_entry_file',
  timestamps: false
});

export default LogEntryFile;
