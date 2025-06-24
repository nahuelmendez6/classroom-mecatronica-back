// src/models/module.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

import SubModule from './sub.module.model.js';
import Teacher from './teacher.model.js';
import User from './user.model.js';
import ModuleTeacher from '../models/module.teacher.model.js';



const Module = sequelize.define('Module', {
  id_module: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  duration: DataTypes.INTEGER,
  icon_url: DataTypes.STRING,
  id_course: DataTypes.INTEGER,
}, {
  tableName: 'module',
  timestamps: false,
});

Module.getAll = async function () {
  return await Module.findAll();
};

Module.getStats = async function () {
  const query = `
    SELECT 
      COUNT(*) AS totalModules,
      (
        SELECT COUNT(*) 
        FROM submodule
      ) AS totalSubmodules,
      (
        SELECT COUNT(*) 
        FROM student_module 
        WHERE status IN ('Asignado', 'En Progreso')
      ) AS activeStudents,
      (
        SELECT COUNT(DISTINCT id_teacher) 
        FROM teacher_module
      ) AS assignedTeachers
  `;

  const [rows] = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });

  return {
    totalModules: parseInt(rows.totalModules, 10),
    totalSubmodules: parseInt(rows.totalSubmodules, 10),
    activeStudents: parseInt(rows.activeStudents, 10),
    assignedTeachers: parseInt(rows.assignedTeachers, 10),
  };

};

Module.getAll = async function () {
  return await Module.findAll({
    include: [
      {
        model: SubModule,
        as: 'submodules'
      },
      {
        model: ModuleTeacher,
        as: 'moduleTeachers',
        include: [
          {
            model: Teacher,
            as: 'teacher',
            include: [
              {
                model: User,
                as: 'User'
              }
            ]
          }
        ]
      }
    ]
  });
};


export default Module;
