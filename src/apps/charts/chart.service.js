import ExamMark from "../../models/ExamMarkScore.model.js";
import ExamMarkEntry from "../../models/ExamMarkEntry.model.js";
import Student from "../../models/Student.model.js";
import { Sequelize, Op } from "sequelize";

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

export const getPerformanceDistribution = async (query) => {
  const entryWhere = buildWhereEntry(query);

  const rows = await ExamMark.findAll({
    attributes: [
      "admission_no",
      [Sequelize.fn("AVG", Sequelize.col("percentage")), "avg_percentage"],
    ],
    include: [
      {
        model: ExamMarkEntry,
        where: entryWhere,
        attributes: [],
      },
    ],
    group: ["admission_no"],
    raw: true,
  });

  const ranges = { "90-100": 0, "75-89": 0, "50-74": 0, "<50": 0 };

  rows.forEach((r) => {
    const p = Number(r.avg_percentage);
    if (p >= 90) ranges["90-100"]++;
    else if (p >= 75) ranges["75-89"]++;
    else if (p >= 50) ranges["50-74"]++;
    else ranges["<50"]++;
  });

  return Object.entries(ranges).map(([subject, avg_score]) => ({
    subject,
    avg_score,
  }));
};

export const getSubjectPassFail = async (query) => {
  const entryWhere = buildWhereEntry(query);

  const rows = await ExamMark.findAll({
    attributes: [
      [Sequelize.col("exam_mark_entry.subject"), "subject"],
      [
        Sequelize.fn(
          "SUM",
          Sequelize.literal(
            "CASE WHEN percentage >= 40 THEN 1 ELSE 0 END"
          )
        ),
        "pass",
      ],
      [
        Sequelize.fn(
          "SUM",
          Sequelize.literal(
            "CASE WHEN percentage < 40 THEN 1 ELSE 0 END"
          )
        ),
        "fail",
      ],
    ],
    include: [
      {
        model: ExamMarkEntry,
        where: entryWhere,
        attributes: [],
      },
    ],
    group: [Sequelize.col("exam_mark_entry.subject")],
    raw: true,
  });

  return rows.flatMap((r) => [
    { subject: r.subject, term: "Pass", avg_score: Number(r.pass) },
    { subject: r.subject, term: "Fail", avg_score: Number(r.fail) },
  ]);
};

export const getSubjectAverage = async (query) => {
  const entryWhere = buildWhereEntry(query);

  const rows = await ExamMark.findAll({
    attributes: [
      [Sequelize.col("exam_mark_entry.subject"), "subject"],
      [Sequelize.fn("AVG", Sequelize.col("percentage")), "avg_score"],
    ],
    include: [
      {
        model: ExamMarkEntry,
        where: entryWhere,
        attributes: [],
      },
    ],
    group: [Sequelize.col("exam_mark_entry.subject")],
    raw: true,
  });

  return rows.map((r) => ({
    subject: r.subject,
    avg_score: Number(r.avg_score).toFixed(2),
  }));
};

export const getTermComparison = async (query) => {
  const entryWhere = buildWhereEntry(query);

  const rows = await ExamMark.findAll({
    attributes: [
      [Sequelize.col("exam_mark_entry.subject"), "subject"],
      [Sequelize.col("exam_mark_entry.term"), "term"],
      [Sequelize.fn("AVG", Sequelize.col("percentage")), "avg_score"],
    ],
    include: [
      {
        model: ExamMarkEntry,
        where: entryWhere,
        attributes: [],
      },
    ],
    group: [
      Sequelize.col("exam_mark_entry.subject"),
      Sequelize.col("exam_mark_entry.term"),
    ],
    raw: true,
  });

  return rows.map((r) => ({
    subject: r.subject,
    term: r.term,
    avg_score: Number(r.avg_score).toFixed(2),
  }));
};

export const getReportSubjectAvg = async (query) => {
  const entryWhere = buildWhereEntry(query);

  return await ExamMark.findAll({
    attributes: [
      [Sequelize.col("exam_mark_entry.subject"), "subject"],
      [Sequelize.fn("AVG", Sequelize.col("percentage")), "avg_score"],
    ],
    include: [
      {
        model: ExamMarkEntry,
        where: entryWhere,
        attributes: [],
      },
    ],
    group: [Sequelize.col("exam_mark_entry.subject")],
    raw: true,
  });
};

export const getReportTermAvg = async (query) => {
  const entryWhere = buildWhereEntry(query);

  return await ExamMark.findAll({
    attributes: [
      [Sequelize.col("exam_mark_entry.term"), "term"],
      [Sequelize.fn("AVG", Sequelize.col("percentage")), "avg_score"],
    ],
    include: [
      {
        model: ExamMarkEntry,
        where: entryWhere,
        attributes: [],
      },
    ],
    group: [Sequelize.col("exam_mark_entry.term")],
    raw: true,
  });
};
