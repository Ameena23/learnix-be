import Student from "../../models/Student.model.js";
import { Sequelize } from "sequelize";

export const getBatches = async (class_number) => {
  const where = {};
  if (class_number && class_number !== "ALL") {
    where.class = class_number;
  }

  const rows = await Student.findAll({
    attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("division")), "division"]],
    where,
    raw: true,
  });

  return rows.map((r) => r.division);
};

export const getClasses = async () => {
  const rows = await Student.findAll({
    attributes: [
      [Sequelize.fn("DISTINCT", Sequelize.col("class")), "class"],
    ],
    order: [[Sequelize.col("class"), "ASC"]],
    raw: true,
  });

  return rows.map((r) => r.class);
};
