import {
  getTopStudentsOverall,
  getTopStudentsSubject,
  getLeaderboard,
} from "./table.service.js";

export const topStudentsOverall = async (req, res) => {
  try {
    const data = await getTopStudentsOverall(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const topStudentsSubject = async (req, res) => {
  try {
    const data = await getTopStudentsSubject(req.query);
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const leaderboard = async (req, res) => {
  try {
    const data = await getLeaderboard();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
