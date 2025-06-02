// src/models/index.js
import User from './user.model.js';
import Student from './student.model.js';
import sequelize from '../config/sequalize.js';

import CompanyContact from './company.contact.model.js';
// otros modelos...

// Asociaciones (después de definir TODOS los modelos)
CompanyContact.belongsTo(User, {
  foreignKey: 'id_user',
});


// Definí asociaciones acá, luego que los modelos estén definidos
Student.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Student, { foreignKey: 'user_id' });

export { sequelize,User, Student, CompanyContact };
