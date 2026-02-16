import StudentMarks from "../../models/StudentMarks.model.js";
import sequelize from "../../config/db.js";

export const getStudentsForAttendance = async (class_number, batch) => {
  if (!class_number || !batch) {
    return [];
  }

  const students = await StudentMarks.findAll({
    attributes: [
      [sequelize.fn("DISTINCT", sequelize.col("admission_no")), "admission_no"],
      "student_name",
    ],
    where: {
      class_number: Number(class_number),
      batch: batch,
    },
    order: [["student_name", "ASC"]],
    raw: true,
  });

  return students;
};
