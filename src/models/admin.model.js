import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';
import User from './user.model.js';

const Admin = sequelize.define('Admin', {
  id_admin: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id_user'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'admin',
  timestamps: false
});

Admin.belongsTo(User, { foreignKey: 'id_user' });
User.hasOne(Admin, { foreignKey: 'id_user' });

export default Admin; 