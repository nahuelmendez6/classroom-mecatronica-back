import { DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js';

const SubModule = sequelize.define('SubModule', {
    id_sub_module: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      id_module: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'sub_module',
      timestamps: false,
      underscored: true
});

export default SubModule;