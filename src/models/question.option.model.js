import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const QuestionOption = sequelize.define('QuestionOption', {
  id_option: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_question: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  option_text: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'question_option',
  timestamps: false,
});

export default QuestionOption;
