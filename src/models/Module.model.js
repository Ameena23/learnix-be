import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Module = sequelize.define(
    "Module",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: "modules",
        timestamps: false,
    }
);

export default Module;
