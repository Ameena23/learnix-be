import sequelize from "../../config/db.js";
import UsersList from "../../models/UsersDetails.model.js";
import UserDetailStudent from "../../models/userDetailStudent.model.js";
import Student from "../../models/Student.model.js";

import { getSubjectDetails } from "../../config/constants.js";

// Universal password for all parents
const UNIVERSAL_PARENT_PASSWORD = "parent123";

export async function createUserDetailsService(payload) {
  console.log("🔧 createUserDetailsService called with:", payload);

  const transaction = await sequelize.transaction();
  console.log("📊 Transaction started");

  try {
    const {
      name,
      email,
      password,
      gender = "M",
      role = "student",
      class: studentClass,
      division,
      subjects = [],
      parent_name,
      parent_email,
      academic_year,
      phone_no,
      address
    } = payload;

    // ---------------- 1️⃣ CREATE STUDENT USER ----------------
    const user = await UsersList.create(
      {
        name: name.trim(),
        email: email?.trim() || `${name.toLowerCase().replace(/\s+/g, "")}@school.com`,
        password: password || generateRandomPassword(),
        gender,
        role,
        phone_no: phone_no?.trim(),
        address: address?.trim()
      },
      { transaction }
    );

    console.log(`✅ Student user created: ${user.usercode}`);
    const { usercode, id: userId } = user;

    // ---------------- 2️⃣ CREATE OR GET PARENT ----------------
    let parentUser = null;
    if (role === "student" && parent_name && parent_email) {
      parentUser = await UsersList.findOne({
        where: { email: parent_email.trim() },
        transaction
      });

      if (!parentUser) {
        parentUser = await UsersList.create(
          {
            name: parent_name.trim(),
            email: parent_email.trim(),
            password: UNIVERSAL_PARENT_PASSWORD,
            gender: null, // parent gender must be null
            role: "parent",
            phone_no: phone_no?.trim(), // same as student
            address: address?.trim()     // same as student
          },
          { transaction }
        );
        console.log(`✅ Parent created: ${parentUser.usercode}`);
      } else {
        console.log(`ℹ Parent already exists: ${parentUser.usercode}`);
        // Optionally update contact info if it's missing? The user didn't ask for it but good to note.
      }
    }

    // ---------------- 3️⃣ STUDENT DETAILS ----------------
    const lastStudent = await UserDetailStudent.findOne({
      where: {
        admission_no: { [sequelize.Sequelize.Op.ne]: null }
      },
      order: [["id", "DESC"]],
      transaction
    });

    const lastNo = lastStudent?.admission_no;
    const nextNo = lastNo ? parseInt(lastNo.replace("ADM", "")) + 1 : 1;
    const admission_no = `ADM${String(nextNo).padStart(4, "0")}`;

    await UserDetailStudent.create(
      {
        student_id: userId,
        usercode,
        parent_id: parentUser?.id || null, // link parent
        admission_no,
        class: studentClass?.trim(),
        division: division?.trim(),
        subjects: subjects.map(s => getSubjectDetails(s)), // store as array of objects with fixed IDs
        parent_name: parent_name?.trim() || null,
        parent_email: parent_email?.trim() || null,
        academic_year: academic_year?.trim()
      },
      { transaction }
    );

    // ---------------- 4️⃣ STUDENTS TABLE ----------------
    await Student.create(
      {
        student_id: userId, // make sure this column exists
        admission_no,
        name: name.trim(),
        gender: gender === "M" ? "Male" : gender === "F" ? "Female" : "Other",
        class: studentClass?.trim(),
        division: division?.trim(),
        academic_year: academic_year?.trim()
      },
      { transaction }
    );

    await transaction.commit();
    console.log("✅ Transaction committed");

    return {
      id: userId,
      usercode,
      name,
      role,
      class: studentClass,
      division,
      academic_year,
      subjects, // IDs returned
      parent_id: parentUser?.id || null,
      parent_usercode: parentUser?.usercode || null
    };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("❌ Error in createUserDetailsService:", error);
    if (error.name === 'SequelizeValidationError') {
      console.error("Validation details:", error.errors.map(e => ({
        field: e.path,
        message: e.message,
        value: e.value
      })));
    }
    console.log("↩️ Transaction rolled back");
    throw error;
  }
}

// ---------------- HELPER ----------------
function generateRandomPassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
