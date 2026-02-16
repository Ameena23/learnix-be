import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import UsersList from "./UsersDetails.model.js";

const UserDetailStudent = sequelize.define(
  "users_student",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    student_id: { // ADDED: Foreign key to users_details.id
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UsersList,
        key: "id"
      },
      onDelete: 'CASCADE'
    },
    usercode: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: UsersList,
        key: "usercode"
      },
      onDelete: 'CASCADE'
    },
    admission_no: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      defaultValue: null
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false
    },
    division: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subjects: {
      type: DataTypes.JSON, // Array of objects
      allowNull: false,
      defaultValue: []
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: UsersList,
        key: "id"
      },
      onDelete: 'SET NULL'
    },


    parent_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parent_email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    academic_year: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "users_student",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

/* Auto-generate admission_no: ADM0001 format */
UserDetailStudent.beforeValidate(async (student) => {
  // Only generate admission_no if it's explicitly missing AND we want it (usually for students)
  // For teachers, we will leave it null or they won't trigger this if they don't have this field set.
  if (!student.admission_no) {
    const lastStudent = await UserDetailStudent.findOne({
      where: {
        admission_no: { [sequelize.Sequelize.Op.ne]: null }
      },
      order: [["id", "DESC"]],
    });

    // If we're creating a student record (we can assume if user_id refers to a student)
    // For now, let's just make it only run if we want to.
    // Actually, I'll just check if student_id belongs to a student.
    const user = await UsersList.findByPk(student.student_id);
    if (user && user.role === 'student') {
      const nextId = lastStudent ? parseInt(lastStudent.admission_no.replace('ADM', '')) + 1 : 1;
      student.admission_no = `ADM${String(nextId).padStart(4, "0")}`;
    }
  }
});

// Define Associations
UsersList.hasMany(UserDetailStudent, { foreignKey: 'student_id', as: 'teacherDetails' });
UserDetailStudent.belongsTo(UsersList, { foreignKey: 'student_id', as: 'user' });

export default UserDetailStudent;