import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const QueryResponse = sequelize.define('QueryResponse', {
  id_response: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_query: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_teacher: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  response_message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'query_response',
  timestamps: false,
});

export default QueryResponse;
