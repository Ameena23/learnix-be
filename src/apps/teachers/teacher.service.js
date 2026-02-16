import UsersList from "../../models/UsersDetails.model.js";
import UserDetailStudent from "../../models/userDetailStudent.model.js";


// Get current academic year
export const getCurrentAcademicYear = () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  return `${currentYear}-${nextYear}`;
};

import { getSubjectDetails } from "../../config/constants.js";

// Transform subjects array to object array with fixed IDs
export const transformSubjects = (subjectsArray) => {
  if (!Array.isArray(subjectsArray)) {
    return [];
  }

  return subjectsArray.map((subject) => {
    const details = getSubjectDetails(subject);
    return {
      ...details,
      code: details.name.toUpperCase().replace(/\s+/g, '_'),
      is_active: true,
    };
  });
};

// Check if email exists
export const checkEmailExists = async (email) => {
  return await UsersList.findOne({ where: { email } });
};

// Check if usercode exists
export const checkUsercodeExists = async (usercode) => {
  if (!usercode) return false;
  return await UsersList.findOne({ where: { usercode } });
};

// Validate endorsements
export const validateEndorsements = (endorsements) => {
  if (endorsements.length === 0) return true;

  for (const endorsement of endorsements) {
    if (!endorsement.class || !endorsement.batch) {
      return { valid: false, message: "Each endorsement must have class and batch" };
    }

    if (!Array.isArray(endorsement.subjects) || endorsement.subjects.length === 0) {
      return { valid: false, message: "Each endorsement must have at least one subject" };
    }
  }

  return { valid: true };
};

// Create teacher with endorsements
export const createTeacherWithEndorsements = async (teacherData) => {
  const {
    usercode,
    name,
    email,
    password,
    gender,
    endorsements = [],
    academic_year,
    created_by = "admin",
  } = teacherData;

  const finalAcademicYear = academic_year || getCurrentAcademicYear();

  // Start transaction
  const transaction = await UsersList.sequelize.transaction();

  try {
    // Create teacher in users_details table
    const teacher = await UsersList.create({
      usercode: usercode || null,
      name,
      email,
      password: password,
      gender,
      role: "teacher",
      phone_no: teacherData.phone_no || null,
      address: teacherData.address || null,
      // is_active: true,
    }, { transaction });

    console.log("Teacher created in users_details:", teacher.usercode);

    // Create teacher endorsements in users_student table
    let createdEndorsements = [];
    if (endorsements.length > 0) {
      const teacherEndorsements = endorsements.map((endorsement) => ({
        student_id: teacher.id, // using same column for both students and teachers
        usercode: teacher.usercode,
        class: endorsement.class,
        division: endorsement.batch,
        subjects: transformSubjects(endorsement.subjects),
        academic_year: finalAcademicYear,
        // created_by,
        // updated_by: created_by,
        // is_active: true,
      }));

      createdEndorsements = await UserDetailStudent.bulkCreate(teacherEndorsements, { transaction });
      console.log(`Created ${teacherEndorsements.length} teacher endorsements in users_student table`);
    }

    // Commit transaction
    await transaction.commit();

    return {
      success: true,
      teacher,
      endorsements: createdEndorsements,
      academic_year: finalAcademicYear,
    };

  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    console.error("Transaction error:", error);
    throw error;
  }
};

// Find teacher by email
export const findTeacherByEmail = async (email) => {
  return await UsersList.findOne({
    where: {
      email,
      role: 'teacher',
      // is_active: true,
    },
    include: [{
      model: UserDetailStudent,
      as: "teacherDetails",
      attributes: ["id", "class", "division", "subjects", "academic_year"],
      // where: { is_active: true },
      required: false,
    }],
  });
};

// Verify teacher credentials
export const verifyTeacherCredentials = (password, teacherPassword) => {
  return password === teacherPassword;
};

// Update teacher last login
export const updateTeacherLastLogin = async (teacher) => {
  teacher.last_login = new Date();
  await teacher.save();
  return teacher;
};

// Get all teachers with details
export const getAllTeachersWithDetails = async () => {
  return await UsersList.findAll({
    where: {
      role: 'teacher',
      // is_active: true,
    },
    attributes: ["id", "usercode", "name", "email", "gender", "created_at", "last_login"],
    include: [{
      model: UserDetailStudent,
      as: "teacherDetails",
      attributes: ["id", "class", "division", "subjects", "academic_year"],
      // where: { is_active: true },
      required: false,
    }],
    order: [["created_at", "DESC"]],
  });
};

// Get teacher by ID with details
export const getTeacherByIdWithDetails = async (id) => {
  return await UsersList.findOne({
    where: {
      id,
      role: 'teacher',
      // is_active: true,
    },
    include: [{
      model: UserDetailStudent,
      as: "teacherDetails",
      attributes: ["id", "class", "division", "subjects", "academic_year", "created_at"],
      // where: { is_active: true },
      required: false,
    }],
  });
};

// Find teacher by ID
export const findTeacherById = async (teacher_id) => {
  return await UsersList.findOne({
    where: {
      id: teacher_id,
      role: 'teacher',
      // is_active: true,
    },
  });
};

// Check if endorsement exists
export const checkEndorsementExists = async (teacher_id, class_name, division, academic_year) => {
  return await UserDetailStudent.findOne({
    where: {
      student_id: teacher_id,
      class: class_name,
      division,
      academic_year,
      // is_active: true,
    },
  });
};

// Create teacher endorsement
export const createTeacherEndorsement = async (endorsementData) => {
  const {
    teacher_id,
    teacher,
    class: class_name,
    division,
    subjects,
    academic_year,
    updated_by = "admin",
  } = endorsementData;

  return await UserDetailStudent.create({
    student_id: teacher_id,
    usercode: teacher.usercode,
    class: class_name,
    division,
    subjects: transformSubjects(subjects),
    academic_year,
    // created_by: updated_by,
    // updated_by,
    // is_active: true,
  });
};

// Find endorsement by ID
export const findEndorsementById = async (endorsement_id) => {
  return await UserDetailStudent.findByPk(endorsement_id);
};

// Update endorsement subjects
export const updateEndorsementSubjects = async (endorsement, subjects, updated_by) => {
  endorsement.subjects = transformSubjects(subjects);
  // endorsement.updated_by = updated_by;
  await endorsement.save();
  return endorsement;
};