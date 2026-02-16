import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Permission = sequelize.define(
    "Permission",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        role: {
            type: DataTypes.ENUM("admin", "teacher", "student", "parent"),
            allowNull: false,
        },
        moduleName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        can_create: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        can_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        can_update: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        can_delete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "permissions",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        indexes: [
            {
                unique: true,
                fields: ["role", "moduleName"]
            }
        ]
    }
);

export default Permission;
