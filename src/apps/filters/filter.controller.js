import { getBatches, getClasses } from "./filter.service.js";

export const batches = async (req, res) => {
  try {
    const data = await getBatches(req.query.class_number);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const classes = async (req, res) => {
  try {
    const data = await getClasses();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
