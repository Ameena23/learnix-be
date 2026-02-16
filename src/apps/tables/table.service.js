import ExamMark from "../../models/ExamMarkScore.model.js";
import ExamMarkEntry from "../../models/ExamMarkEntry.model.js";
import Student from "../../models/Student.model.js";
import { Sequelize } from "sequelize";

const buildWhereEntry = (query) => {
  const where = {};
  if (query.class_number && query.class_number !== "ALL") {
    where.class = query.class_number;
  }
  if (query.batch && query.batch !== "ALL") {
    where.division = query.batch;
  }
  return where;
};

export const getTopStudentsOverall = async (query) => {
  const entryWhere = buildWhereEntry(query);

  const rows = await ExamMark.findAll({
    attributes: [
      "admission_no",
      [Sequelize.col("Student.name"), "student_name"],
      [Sequelize.fn("AVG", Sequelize.col("percentage")), "avg_marks"],
    ],
    include: [
      {
        model: ExamMarkEntry,
        where: entryWhere,
        attributes: [],
      },
      {
        model: Student,
        attributes: [],
      },
    ],
    group: ["admission_no", "Student.name"],
    order: [[Sequelize.literal("avg_marks"), "DESC"]],
    limit: 5,
    raw: true,
  });

  return rows.map((r, i) => ({
    rank: i + 1,
    admission_no: r.admission_no,
    student_name: r.student_name,
    avg_marks: Number(r.avg_marks).toFixed(2),
  }));
};

export const getTopStudentsSubject = async (query) => {
  const entryWhere = buildWhereEntry(query);

  const rows = await ExamMark.findAll({
    attributes: [
      [Sequelize.col("exam_mark_entry.subject"), "subject"],
      [Sequelize.col("Student.name"), "student_name"],
      [Sequelize.col("exam_mark_entry.class"), "class_number"],
      [Sequelize.col("exam_mark_entry.division"), "batch"],
      [Sequelize.fn("SUM", Sequelize.col("scored_mark")), "total_marks"],
      [Sequelize.fn("AVG", Sequelize.col("percentage")), "avg_score"],
    ],
    include: [
      {
        model: ExamMarkEntry,
        where: entryWhere,
        attributes: [],
      },
      {
        model: Student,
        attributes: [],
      },
    ],
    group: [
      "exam_mark_entry.subject",
      "Student.name",
      "exam_mark_entry.class",
      "exam_mark_entry.division",
    ],
    order: [
      [Sequelize.col("exam_mark_entry.subject"), "ASC"],
      [Sequelize.literal("avg_score"), "DESC"],
    ],
    raw: true,
  });

  const ranked = {};
  const finalData = [];

  rows.forEach((r) => {
    if (!ranked[r.subject]) ranked[r.subject] = 1;

    finalData.push({
      rank: ranked[r.subject]++,
      subject: r.subject,
      student_name: r.student_name,
      total_marks: r.total_marks,
      avg_score: Number(r.avg_score).toFixed(2),
      class_number: r.class_number,
      batch: r.batch,
    });
  });

  return finalData.slice(0, 5);
};

export const getLeaderboard = async () => {
  const rows = await ExamMark.findAll({
    attributes: [
      [Sequelize.col("Student.name"), "student_name"],
      [Sequelize.col("exam_mark_entry.class"), "class_number"],
      [Sequelize.col("exam_mark_entry.division"), "batch"],
      [Sequelize.fn("AVG", Sequelize.col("percentage")), "percentage"],
    ],
    include: [
      {
        model: ExamMarkEntry,
        attributes: [],
      },
      {
        model: Student,
        attributes: [],
      },
    ],
    group: ["Student.name", "exam_mark_entry.class", "exam_mark_entry.division"],
    order: [[Sequelize.literal("percentage"), "DESC"]],
    limit: 5,
    raw: true,
  });

  return rows.map((r, index) => ({
    rank: index + 1,
    student_name: r.student_name,
    class_number: r.class_number,
    batch: r.batch,
    percentage: Number(r.percentage).toFixed(2),
  }));
};
