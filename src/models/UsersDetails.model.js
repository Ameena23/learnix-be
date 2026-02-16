import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UsersList = sequelize.define(
  "users_list",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usercode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: { // Changed from 'name' to 'fullname'
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM("M", "F", "O"),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM("student", "teacher", "admin", "parent"), // Added 'parent' explicitly if not present or just keeping it
      allowNull: false
    },

    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_no: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    tableName: "users_list",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

/* Auto-generate user code: STU-0001 format */
UsersList.beforeValidate(async (user) => {
  if (!user.usercode) {
    let prefix = 'USR-';
    if (user.role === 'student') prefix = 'STU-';
    else if (user.role === 'teacher') prefix = 'TEA-';
    else if (user.role === 'parent') prefix = 'PRT-';

    const lastUser = await UsersList.findOne({
      where: {
        role: user.role,
        usercode: { [sequelize.Sequelize.Op.like]: `${prefix}%` }
      },
      order: [["id", "DESC"]],
    });

    let nextId = 1;
    if (lastUser && lastUser.usercode) {
      const match = lastUser.usercode.match(/\d+$/);
      if (match) {
        nextId = parseInt(match[0]) + 1;
      }
    }

    user.usercode = `${prefix}${String(nextId).padStart(4, "0")}`;
  }
});

export default UsersList;

