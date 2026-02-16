import { getStudentsForAttendance } from "./basicStudent.service.js";

export const getStudents = async (req, res) => {
  try {
    const { class_number, batch } = req.query;
    const data = await getStudentsForAttendance(class_number, batch);
    res.json({ success: true, data });
  } catch (err) {
    console.error("STUDENT FETCH FAILED:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
