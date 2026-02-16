/**
 * Common Controller
 * Handles shared/common API endpoints across the application
 */

/**
 * Get Basic Data (Classes, Subjects, Batches)
 * @route POST /api/get/basic/json
 * @access Public/Protected (depending on your auth setup)
 */
import { CLASSES, SUBJECTS } from "../../config/constants.js";

/**
 * Get Basic Data (Classes, Subjects, Batches)
 * @route POST /api/get/basic/json
 * @access Public/Protected (depending on your auth setup)
 */
export const getBasicData = (req, res) => {
  try {
    // Classes data with associated batches (mapped for frontend if needed, but constants are already decent)
    const formattedClasses = CLASSES.map(c => ({
      _id: c.id,
      name: c.name,
      batches: c.batches.map(b => ({ _id: b.id, name: b.name }))
    }));

    // Subjects data
    const formattedSubjects = SUBJECTS.map(s => ({
      _id: s.id,
      name: s.name
    }));

    // Send response
    res.status(200).json({
      success: true,
      data: {
        classes: formattedClasses,
        subjects: formattedSubjects
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching basic data",
      error: error.message
    });
  }
};

// Export other common controllers here as needed
// export const anotherController = (req, res) => { ... };