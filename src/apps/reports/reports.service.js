import { Sequelize } from "sequelize";
import puppeteer from 'puppeteer';
import Student from "../../models/Student.model.js";
import ExamMark from "../../models/ExamMarkScore.model.js";
import ExamMarkEntry from "../../models/ExamMarkEntry.model.js";
import StudentTermRemark from "../../models/StudentRemarks.model.js";

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Calculate grade and remark based on percentage
 * @param {Number} percentage - Percentage score
 * @returns {Object} { grade, remark }
 */
export function getGradeAndRemark(percentage) {
  if (percentage >= 90) return { grade: "A+", remark: "Excellent" };
  if (percentage >= 80) return { grade: "A", remark: "Very Good" };
  if (percentage >= 70) return { grade: "B+", remark: "Good" };
  if (percentage >= 60) return { grade: "B", remark: "Above Average" };
  if (percentage >= 50) return { grade: "C", remark: "Average" };
  if (percentage >= 40) return { grade: "D", remark: "Pass" };
  return { grade: "F", remark: "Fail" };
}

// =====================================================
// CHART DATA SERVICES
// =====================================================

/**
 * Get chart data inputs for report card (student vs class average)
 * @param {Object} params - { admission_no, term }
 * @returns {Array} Chart data with subject, student_percentage, class_average
 */
export async function getChartDataInputs({ admission_no, term }) {
  try {
    if (!admission_no) return [];

    const student = await Student.findOne({
      where: { admission_no },
      attributes: ["class", "division"],
    });

    if (!student) return [];

    const { class: className, division: batch } = student;

    // Student subject-wise %
    const studentMarks = await ExamMark.findAll({
      attributes: [
        [Sequelize.col("exam_mark_entry.subject"), "subject"],
        ["percentage", "student_pct"],
      ],
      include: [
        {
          model: ExamMarkEntry,
          where: { term },
          attributes: [],
        },
      ],
      where: { admission_no },
      raw: true,
    });

    // Class average subject-wise %
    const classAvg = await ExamMark.findAll({
      attributes: [
        [Sequelize.col("exam_mark_entry.subject"), "subject"],
        [Sequelize.fn("AVG", Sequelize.col("percentage")), "class_avg"],
      ],
      include: [
        {
          model: ExamMarkEntry,
          where: {
            term,
            class: className,
            division: batch
          },
          attributes: [],
        },
      ],
      group: [Sequelize.col("exam_mark_entry.subject")],
      raw: true,
    });

    return studentMarks.map((s) => {
      const avg = classAvg.find((c) => c.subject === s.subject);

      return {
        subject: s.subject,
        student_percentage: Number(Number(s.student_pct || 0).toFixed(2)),
        class_average: avg
          ? Number(Number(avg.class_avg || 0).toFixed(2))
          : 0,
      };
    });
  } catch (error) {
    console.error("Chart service error:", error);
    return [];
  }
}

/**
 * Get subject-wise average marks for charts
 */
export const getSubjectAverageData = async (where) => {
  // where might contain class_number, batch etc from UI params
  const entryWhere = {};
  if (where.class_number) entryWhere.class = where.class_number;
  if (where.batch) entryWhere.division = where.batch;
  if (where.term) entryWhere.term = where.term;

  const data = await ExamMark.findAll({
    attributes: [
      [Sequelize.col("exam_mark_entry.subject"), "subject"],
      [Sequelize.fn("AVG", Sequelize.col("percentage")), "avg_score"]
    ],
    include: [{
      model: ExamMarkEntry,
      where: entryWhere,
      attributes: []
    }],
    group: [Sequelize.col("exam_mark_entry.subject")],
    order: [[Sequelize.col("exam_mark_entry.subject"), "ASC"]],
    raw: true
  });

  return data.map(d => ({
    subject: d.subject,
    avg_score: Number(d.avg_score).toFixed(2)
  }));
};

/**
 * Get term comparison data (Term 1 vs Term 2)
 */
export const getTermComparisonData = async (where) => {
  const entryWhere = {};
  if (where.class_number) entryWhere.class = where.class_number;
  if (where.batch) entryWhere.division = where.batch;

  const data = await ExamMark.findAll({
    attributes: [
      [Sequelize.col("exam_mark_entry.subject"), "subject"],
      [Sequelize.col("exam_mark_entry.term"), "term"],
      [Sequelize.fn("AVG", Sequelize.col("percentage")), "avg_score"]
    ],
    include: [{
      model: ExamMarkEntry,
      where: entryWhere,
      attributes: []
    }],
    group: [Sequelize.col("exam_mark_entry.subject"), Sequelize.col("exam_mark_entry.term")],
    order: [
      [Sequelize.col("exam_mark_entry.subject"), "ASC"],
      [Sequelize.col("exam_mark_entry.term"), "ASC"]
    ],
    raw: true
  });

  return data.map(d => ({
    subject: d.subject,
    term: d.term,
    avg_score: Number(d.avg_score).toFixed(2)
  }));
};

/**
 * Get top 5 students based on average marks
 */
export const getTopStudentsData = async (where) => {
  const entryWhere = {};
  if (where.class_number) entryWhere.class = where.class_number;
  if (where.batch) entryWhere.division = where.batch;

  const rows = await ExamMark.findAll({
    attributes: [
      "admission_no",
      [Sequelize.col("Student.name"), "student_name"],
      [Sequelize.col("exam_mark_entry.class"), "class_number"],
      [Sequelize.col("exam_mark_entry.division"), "batch"],
      [Sequelize.fn("SUM", Sequelize.col("scored_mark")), "total_marks"],
      [Sequelize.fn("AVG", Sequelize.col("percentage")), "avg_marks"]
    ],
    include: [
      {
        model: ExamMarkEntry,
        where: entryWhere,
        attributes: []
      },
      {
        model: Student,
        attributes: []
      }
    ],
    group: ["admission_no", "Student.name", "exam_mark_entry.class", "exam_mark_entry.division"],
    order: [[Sequelize.literal("avg_marks"), "DESC"]],
    limit: 5,
    raw: true
  });

  return rows.map((s, index) => ({
    rank: index + 1,
    admission_no: s.admission_no,
    student_name: s.student_name,
    class_number: s.class_number,
    batch: s.batch,
    total_marks: Number(s.total_marks),
    avg_marks: Number(s.avg_marks).toFixed(2)
  }));
};

/**
 * Get distinct batches for a specific class
 */
export const getBatchesByClass = async (class_number) => {
  const batches = await Student.findAll({
    attributes: [
      [Sequelize.fn("DISTINCT", Sequelize.col("division")), "batch"]
    ],
    where: { class: class_number },
    order: [["division", "ASC"]],
    raw: true
  });

  return batches.map(b => b.batch);
};

// =====================================================
// REPORT CARD SERVICES
// =====================================================
/**
 * Get complete report card data for a student
 * @param {Object} params - { admission_no, term }
 * @returns {Object} Report card data with student info, marks, grades, and chart data
 */
export async function getReportCardData({ admission_no, term }) {
  const studentInfo = await Student.findOne({
    where: { admission_no },
    raw: true
  });

  if (!studentInfo) return null;

  const rows = await ExamMark.findAll({
    where: { admission_no },
    include: [
      {
        model: ExamMarkEntry,
        where: { term },
        attributes: ["subject", "max_mark", "term", "academic_year"],
      }
    ],
    order: [[Sequelize.col("exam_mark_entry.subject"), "ASC"]],
    raw: true
  });

  if (!rows.length) return null;

  const report = rows.map((r) => {
    const percentage = r.percentage;
    const { grade, remark } = getGradeAndRemark(percentage);
    return {
      subject: r["exam_mark_entry.subject"],
      max_mark: r["exam_mark_entry.max_mark"],
      scored_mark: r.scored_mark,
      percentage: Number(percentage).toFixed(2),
      grade,
      remark
    };
  });

  const termRemark = await StudentTermRemark.findOne({
    where: {
      admission_no,
      term,
      year: rows[0]["exam_mark_entry.academic_year"],
    },
  });

  return {
    student: {
      admission_no: studentInfo.admission_no,
      student_name: studentInfo.name,
      class_number: studentInfo.class,
      batch: studentInfo.division,
      term: term,
      year: rows[0]["exam_mark_entry.academic_year"],
    },
    data: report,
    graphic_data: await getChartDataInputs({ admission_no, term }),
    term_remark: termRemark ? termRemark.remark : "",
  };
}

/**
 * Save or update term remark for a student
 * @param {Object} params - { admission_no, term, year, remark, created_by }
 * @returns {Object} { isNew: boolean }
 */
export async function saveTermRemark({ admission_no, term, year, remark, created_by }) {
  const [remarkRecord, created] = await StudentTermRemark.findOrCreate({
    where: { admission_no, term, year },
    defaults: { remark, created_by }
  });

  if (!created) {
    remarkRecord.remark = remark;
    remarkRecord.created_by = created_by;
    await remarkRecord.save();
  }

  return { isNew: created };
}

// =====================================================
// CHART RENDERING SERVICE (PUPPETEER)
// =====================================================

/**
 * Generate a chart PNG image for report card using Puppeteer and Highcharts
 * @param {Array} graphic_data - Array of subject performance data
 * @returns {String} Base64 encoded PNG image as data URI
 */
export async function renderReportCardChartPNG(graphic_data) {
  let browser;

  try {
    console.log('Launching browser for chart generation...');

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    console.log('Setting viewport...');
    await page.setViewport({ width: 800, height: 600 });

    const subjectColors = {
      English: "#1e40af",
      Maths: "#6b21a8",
      Science: "#15803d",
    };

    const CLASS_AVG_COLOR = "#4b5563";

    const html = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <style>
    body { margin: 0; padding: 20px; background: white; }
    #container { width: 800px; height: 400px; }
  </style>
</head>
<body>
  <div id="container"></div>
  <script>
    Highcharts.chart('container', {
      chart: {
        type: 'column',
        backgroundColor: '#ffffff',
        width: 800,
        height: 400,
        events: {
          load: function() {
            window.chartReady = true;
          }
        }
      },
      title: {
        text: 'Student vs Class Average (%)',
        style: {
          fontSize: '16px',
          fontWeight: 'bold'
        }
      },
      xAxis: {
        categories: ${JSON.stringify(graphic_data.map(d => d.subject))},
        title: { text: 'Subjects' }
      },
      yAxis: {
        min: 0,
        max: 100,
        title: { text: 'Percentage (%)' }
      },
      credits: { enabled: false },
      legend: { enabled: true },
      tooltip: {
        shared: true,
        valueSuffix: '%'
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            format: '{y}%'
          }
        }
      },
      series: [
        {
          name: 'Student',
          data: ${JSON.stringify(graphic_data.map(d => ({
      y: d.student_percentage,
      color: subjectColors[d.subject] || "#000000"
    })))}
        },
        {
          name: 'Class Average',
          data: ${JSON.stringify(graphic_data.map(d => ({
      y: d.class_average,
      color: CLASS_AVG_COLOR
    })))}
        }
      ]
    });
  </script>
</body>
</html>
    `;

    console.log('Setting HTML content for chart...');
    await page.setContent(html, {
      waitUntil: 'networkidle2',
      timeout: 20000
    });

    console.log('Waiting for chartReady flag...');
    await page.waitForFunction('window.chartReady === true', {
      timeout: 10000
    });

    const element = await page.$('#container');

    if (!element) {
      throw new Error('Chart container not found');
    }

    const screenshot = await element.screenshot({
      type: 'png',
      encoding: 'base64'
    });

    await browser.close();

    console.log('Chart generated successfully');

    return `data:image/png;base64,${screenshot}`;

  } catch (error) {
    console.error('Error generating chart:', error);
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

/**
 * Get distinct classes from Student table
 */
export const getDistinctClasses = async () => {
  try {
    const classes = await Student.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('class')), 'class']
      ],
      order: [['class', 'ASC']],
      raw: true
    });

    return classes.map(c => c.class);
  } catch (error) {
    console.error('Error fetching distinct classes:', error);
    return [];
  }
};

/**
 * Get distinct batches for a class
 */
export const getDistinctBatchesByClass = async (class_number) => {
  try {
    const batches = await Student.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('division')), 'batch']
      ],
      where: { class: class_number },
      order: [['division', 'ASC']],
      raw: true
    });

    return batches.map(b => b.batch);
  } catch (error) {
    console.error('Error fetching batches for class:', error);
    return [];
  }
};

/**
 * Get students by class and batch
 */
export const getStudentsByClassAndBatch = async (class_number, batch) => {
  try {
    const students = await Student.findAll({
      attributes: [
        'admission_no',
        ['name', 'student_name']
      ],
      where: { class: class_number, division: batch },
      order: [['name', 'ASC']],
      raw: true
    });

    return students;
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

/**
 * Get student details with summary
 */
export const getStudentSummary = async (admission_no) => {
  try {
    const student = await Student.findOne({
      attributes: [
        'admission_no',
        ['name', 'student_name'],
        'class',
        'division',
      ],
      where: { admission_no },
      raw: true
    });

    if (!student) return null;

    const stats = await ExamMark.findOne({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'subject_count'],
        [Sequelize.fn('AVG', Sequelize.col('percentage')), 'avg_percentage']
      ],
      where: { admission_no },
      raw: true
    });

    return {
      admission_no: student.admission_no,
      student_name: student.student_name,
      class_number: student.class,
      batch: student.division,
      subject_count: stats.subject_count,
      avg_percentage: stats.avg_percentage
    };
  } catch (error) {
    console.error('Error fetching student summary:', error);
    return null;
  }
};