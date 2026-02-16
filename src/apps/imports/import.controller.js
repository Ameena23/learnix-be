import { importStudentMarks } from "./import.service.js";

export const importCSV = async (req, res) => {
  try {
    const result = await importStudentMarks();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
