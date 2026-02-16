
import {
  getCurrentAcademicYear,
  transformSubjects,
  checkEmailExists,
  checkUsercodeExists,
  validateEndorsements,
  createTeacherWithEndorsements,
  findTeacherByEmail,
  verifyTeacherCredentials,
  updateTeacherLastLogin,
  getAllTeachersWithDetails,
  getTeacherByIdWithDetails,
  findTeacherById,
  checkEndorsementExists,
  createTeacherEndorsement,
  findEndorsementById,
  updateEndorsementSubjects,
} from "./teacher.service.js";

// Register Teacher
export const registerTeacher = async (req, res) => {
  try {
    const {
      usercode,
      name,
      email,
      password,
      gender,
      endorsements = [],
      academic_year,
      created_by = "admin",
    } = req.body;

    console.log("Teacher registration request received:", {
      usercode,
      name,
      email,
      gender,
      endorsements_count: endorsements.length,
    });

    // Validate required fields
    if (!name || !email || !password || !gender) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, email, password, and gender are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Validate gender
    const validGenders = ["M", "F", "O"];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Gender must be M, F, or O",
      });
    }

    // Check if email already exists
    const existingEmail = await checkEmailExists(email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Check if usercode already exists (if provided)
    const existingUsercode = await checkUsercodeExists(usercode);
    if (existingUsercode) {
      return res.status(400).json({
        success: false,
        message: "Usercode already exists",
      });
    }

    // Validate endorsements
    const endorsementValidation = validateEndorsements(endorsements);
    if (!endorsementValidation.valid) {
      return res.status(400).json({
        success: false,
        message: endorsementValidation.message,
      });
    }

    // Create teacher with endorsements
    const result = await createTeacherWithEndorsements({
      usercode,
      name,
      email,
      password,
      gender,
      phone_no: req.body.phone_no,
      address: req.body.address,
      endorsements,
      academic_year,
      created_by,
    });

    if (!result.success) {
      throw new Error("Failed to create teacher");
    }

    // Get teacher with details
    const teacherWithDetails = await getTeacherByIdWithDetails(result.teacher.id);

    res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
      data: {
        teacher: {
          id: result.teacher.id,
          usercode: result.teacher.usercode,
          name: result.teacher.name,
          email: result.teacher.email,
          gender: result.teacher.gender,
          role: result.teacher.role,
        },
        endorsements: teacherWithDetails?.teacherDetails || [],
        academic_year: result.academic_year,
      },
    });

  } catch (error) {
    console.error("Teacher registration error:", error);

    // Handle specific Sequelize errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry found",
        field: error.errors[0]?.path,
        value: error.errors[0]?.value,
      });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: "Invalid reference data",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to register teacher",
      error: error.message,
    });
  }
};

// Teacher Login
export const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find teacher by email
    const teacher = await findTeacherByEmail(email);

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or teacher not found",
      });
    }

    // Verify password
    const isPasswordValid = verifyTeacherCredentials(password, teacher.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    const updatedTeacher = await updateTeacherLastLogin(teacher);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        teacher: {
          id: updatedTeacher.id,
          usercode: updatedTeacher.usercode,
          name: updatedTeacher.name,
          email: updatedTeacher.email,
          gender: updatedTeacher.gender,
          role: updatedTeacher.role,
          last_login: updatedTeacher.last_login,
        },
        endorsements: updatedTeacher.teacherDetails || [],
      },
    });

  } catch (error) {
    console.error("Teacher login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// Get All Teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await getAllTeachersWithDetails();

    res.json({
      success: true,
      data: teachers,
      count: teachers.length,
    });

  } catch (error) {
    console.error("Get all teachers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teachers",
      error: error.message,
    });
  }
};

// Get Teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await getTeacherByIdWithDetails(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.json({
      success: true,
      data: teacher,
    });

  } catch (error) {
    console.error("Get teacher by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher",
      error: error.message,
    });
  }
};

// Add Teacher Endorsement
export const addTeacherEndorsement = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const { class: class_name, division, subjects, academic_year, updated_by = "admin" } = req.body;

    // Validate required fields
    if (!class_name || !division || !subjects || !academic_year) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: class, division, subjects, and academic_year are required",
      });
    }

    // Check if teacher exists
    const teacher = await findTeacherById(teacher_id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Check if endorsement already exists
    const existingEndorsement = await checkEndorsementExists(
      teacher_id,
      class_name,
      division,
      academic_year
    );

    if (existingEndorsement) {
      return res.status(400).json({
        success: false,
        message: "Endorsement already exists for this class, division, and academic year",
      });
    }

    // Create new endorsement
    const newEndorsement = await createTeacherEndorsement({
      teacher_id,
      teacher,
      class_name,
      division,
      subjects,
      academic_year,
      updated_by,
    });

    res.status(201).json({
      success: true,
      message: "Endorsement added successfully",
      data: newEndorsement,
    });

  } catch (error) {
    console.error("Add teacher endorsement error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add endorsement",
      error: error.message,
    });
  }
};

// Update Teacher Endorsement
export const updateTeacherEndorsement = async (req, res) => {
  try {
    const { endorsement_id } = req.params;
    const { subjects, updated_by = "admin" } = req.body;

    if (!subjects || !Array.isArray(subjects)) {
      return res.status(400).json({
        success: false,
        message: "Subjects array is required",
      });
    }

    const endorsement = await findEndorsementById(endorsement_id);

    if (!endorsement) {
      return res.status(404).json({
        success: false,
        message: "Endorsement not found",
      });
    }

    // Update endorsement
    const updatedEndorsement = await updateEndorsementSubjects(
      endorsement,
      subjects,
      updated_by
    );

    res.json({
      success: true,
      message: "Endorsement updated successfully",
      data: updatedEndorsement,
    });

  } catch (error) {
    console.error("Update teacher endorsement error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update endorsement",
      error: error.message,
    });
  }
};