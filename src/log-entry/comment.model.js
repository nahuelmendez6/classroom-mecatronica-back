import { DataTypes } from "sequelize";
import sequelize from '../config/sequalize.js';
import LogEntry from "./log.entry.model.js";

const Comment = sequelize.define('Comment', {

    id_comment: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_log_entry: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: LogEntry,
            key: 'id_log_entry',
        },
        onDelete: 'CASCADE',
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'comment',
    timestamps: false,
});

export default Comment;