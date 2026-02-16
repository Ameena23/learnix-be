import {
  getPerformanceDistribution,
  getSubjectPassFail,
  getSubjectAverage,
  getTermComparison,
  getReportSubjectAvg,
  getReportTermAvg,
} from "./chart.service.js";

export const performanceDistribution = async (req, res) => {
  try {
    const data = await getPerformanceDistribution(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const subjectPassFail = async (req, res) => {
  try {
    const data = await getSubjectPassFail(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const subjectAverage = async (req, res) => {
  try {
    const data = await getSubjectAverage(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const termComparison = async (req, res) => {
  try {
    const data = await getTermComparison(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const reportSubjectAvg = async (req, res) => {
  try {
    const data = await getReportSubjectAvg(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const reportTermAvg = async (req, res) => {
  try {
    const data = await getReportTermAvg(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
