import { createUserDetailsService } from "./users.service.js";

export async function createUsersDetails(req, res) {
  console.log("📦 Received request to create user:", req.body);
  try {
    const {
      name,
      gender = "M",
      role = "student",
      class: userClass, // Renamed from studentClass to userClass
      division,
      academic_year,
      subjects = [],
      email,
      password,
      phone_no,
      address,
      parent_name,
      parent_email
    } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({
        error: "Name is required"
      });
    }

    if (!role) {
      return res.status(400).json({
        error: "Role is required"
      });
    }

    // Validate phone number format IF provided
    if (phone_no && phone_no.trim()) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone_no)) {
        return res.status(400).json({
          error: "Phone number must be exactly 10 digits"
        });
      }
    }

    // Role-specific validation
    if (role === 'student') {
      // Student-specific validation
      if (!userClass || !division || !academic_year) {
        return res.status(400).json({
          error: "Class, Division, and Academic Year are required for students"
        });
      }

      if (!Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({
          error: "Select at least one subject for students"
        });
      }

      // Validate academic year format for students
      const yearRegex = /^\d{4}-\d{2}$/;
      if (!yearRegex.test(academic_year)) {
        return res.status(400).json({
          error: "Academic Year format: YYYY-YY (e.g., 2024-25)"
        });
      }

      // Parent info is optional
      // if (!parent_name || !parent_name.trim()) {
      //   return res.status(400).json({
      //     error: "Parent Name is required for students"
      //   });
      // }

      // Parent email validation (optional but recommended)
      if (parent_email && parent_email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(parent_email)) {
          return res.status(400).json({
            error: "Valid Parent Email is required if provided"
          });
        }
      }
    } else if (role === 'teacher') {
      // Teacher-specific validation
      if (!userClass || !division) {
        return res.status(400).json({
          error: "Class and Division/Batch are required for teachers"
        });
      }

      // Subjects validation for teachers (array of objects)
      if (!Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({
          error: "Subjects are required for teachers"
        });
      }

      // Validate each subject object
      const validSubjects = subjects.every(subject => {
        // Check if subject is an object with required properties
        return subject &&
          typeof subject === 'object' &&
          subject.name &&
          typeof subject.name === 'string' &&
          subject.name.trim();
      });

      if (!validSubjects) {
        return res.status(400).json({
          error: "Each subject must be an object with a 'name' property"
        });
      }

      // Teachers don't need academic_year or parent info
    }

    const userData = await createUserDetailsService({
      name: name.trim(),
      gender,
      role,
      class: userClass || null,
      division: division || null,
      academic_year: academic_year || null,
      subjects: subjects,
      email: email?.trim() || null,
      password,
      phone_no: phone_no?.trim() || null,
      address: address?.trim() || null,
      parent_name: parent_name?.trim() || null,
      parent_email: parent_email?.trim() || null
    });

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
      user: userData
    });

  } catch (err) {
    console.error("Create user error:", err.message);

    if (err.message.includes('already') || err.message.includes('exists')) {
      return res.status(409).json({ error: err.message });
    }

    res.status(500).json({
      error: `Failed to create ${req.body.role || 'user'}`,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}