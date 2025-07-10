import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';
import Task from './task.model.js';
// Assuming QuestionType model exists
// import QuestionType from './question.type.model.js'; 

const TaskQuestionnaire = sequelize.define('TaskQuestionnaire', {
  id_question: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_task: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Task,
      key: 'id_task',
    },
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  id_question_type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // references: {
    //   model: QuestionType,
    //   key: 'id_question_type',
    // },
  },
}, {
  tableName: 'task_questionnaire',
  timestamps: false,
});

export default TaskQuestionnaire;