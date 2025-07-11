import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const Query = sequelize.define('Query', {
  id_query: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, {
  tableName: 'query',
  timestamps: false,
});

export default Query;
