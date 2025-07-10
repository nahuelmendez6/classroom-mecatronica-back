import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const QuestionType = sequelize.define('QuestionType', {
  id_question_type: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'question_type',
  timestamps: false,
});

export default QuestionType;