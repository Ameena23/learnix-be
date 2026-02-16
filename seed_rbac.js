import sequelize from "./src/config/db.js";
import Module from "./src/models/Module.model.js";
import Permission from "./src/models/Permission.model.js";

const modules = [
    { name: "dashboard", displayName: "Dashboard" },
    { name: "student_mark_entry", displayName: "Student Mark Entry" },
    { name: "exam_mark_view_edit", displayName: "Exam Mark View/Edit" },
    { name: "attendance", displayName: "Attendance" },
    { name: "reports", displayName: "Reports" },
    { name: "user_management", displayName: "User Management" },
];

const initialPermissions = [
    // Admin
    ...modules.map(m => ({
        role: "admin",
        moduleName: m.name,
        can_create: true,
        can_read: true,
        can_update: true,
        can_delete: true,
    })),
    // Teacher
    { role: "teacher", moduleName: "dashboard", can_read: true },
    { role: "teacher", moduleName: "student_mark_entry", can_create: true, can_read: true, can_update: true, can_delete: true },
    { role: "teacher", moduleName: "exam_mark_view_edit", can_read: true, can_update: true },
    { role: "teacher", moduleName: "attendance", can_create: true, can_read: true, can_update: true, can_delete: true },
    { role: "teacher", moduleName: "reports", can_read: true },
    // Student
    { role: "student", moduleName: "dashboard", can_read: true },
    { role: "student", moduleName: "attendance", can_read: true },
    { role: "student", moduleName: "reports", can_read: true },
    { role: "student", moduleName: "exam_mark_view_edit", can_read: true },
    // Parent
    { role: "parent", moduleName: "dashboard", can_read: true },
    { role: "parent", moduleName: "attendance", can_read: true },
    { role: "parent", moduleName: "reports", can_read: true },
    { role: "parent", moduleName: "exam_mark_view_edit", can_read: true },
];

async function seed() {
    try {
        await sequelize.authenticate();
        console.log("Database connected for seeding");

        await sequelize.sync(); // This will create tables if they don't exist

        for (const m of modules) {
            await Module.upsert(m);
        }
        console.log("Modules seeded");

        for (const p of initialPermissions) {
            await Permission.upsert(p, {
                conflictFields: ['role', 'moduleName']
            });
        }
        console.log("Permissions seeded");

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
