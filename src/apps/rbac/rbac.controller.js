import Permission from "../../models/Permission.model.js";
import Module from "../../models/Module.model.js";

// ----------------------
// Get all modules
// ----------------------
export const getAllModules = async (req, res) => {
    try {
        const modules = await Module.findAll();
        res.json({ success: true, data: modules });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ----------------------
// Get permissions by role
// ----------------------
export const getPermissionsByRole = async (req, res) => {
    try {
        const { role } = req.params;
        const permissions = await Permission.findAll({ where: { role } });
        res.json({ success: true, data: permissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ----------------------
// Update single permission
// ----------------------
export const updatePermission = async (req, res) => {
    try {
        const { role, moduleName, can_create, can_read, can_update, can_delete } = req.body;

        const [permission, created] = await Permission.findOrCreate({
            where: { role, moduleName },
            defaults: { can_create, can_read, can_update, can_delete }
        });

        if (!created) {
            await permission.update({ can_create, can_read, can_update, can_delete });
        }

        res.json({ success: true, message: "Permission updated successfully", data: permission });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ----------------------
// Get permissions of current user
// ----------------------
export const getUserPermissions = async (req, res) => {
    try {
        const role = req.headers['x-user-role'];
        if (!role) {
            return res.status(400).json({ success: false, message: "Role is required in headers" });
        }

        if (role === 'admin') {
            const modules = await Module.findAll();
            const adminPermissions = modules.map(m => ({
                moduleName: m.name,
                can_create: true,
                can_read: true,
                can_update: true,
                can_delete: true
            }));
            return res.json({ success: true, data: adminPermissions });
        }

        const permissions = await Permission.findAll({ where: { role } });
        res.json({ success: true, data: permissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ----------------------
// Bulk update permissions
// ----------------------
export const bulkUpdatePermissions = async (req, res) => {
    try {
        const { role, permissions } = req.body;

        if (!role || !Array.isArray(permissions)) {
            return res.status(400).json({ success: false, message: "Invalid request" });
        }

        if (role === "admin") {
            return res.status(403).json({ success: false, message: "Admin permissions cannot be modified" });
        }

        let updatedCount = 0;

        for (const perm of permissions) {
            const existing = await Permission.findOne({
                where: { role, moduleName: perm.moduleName }
            });

            if (!existing) {
                await Permission.create({
                    role,
                    moduleName: perm.moduleName,
                    can_create: perm.can_create,
                    can_read: perm.can_read,
                    can_update: perm.can_update,
                    can_delete: perm.can_delete,
                });
                updatedCount++;
                continue;
            }

            const hasChanged =
                existing.can_create !== perm.can_create ||
                existing.can_read !== perm.can_read ||
                existing.can_update !== perm.can_update ||
                existing.can_delete !== perm.can_delete;

            if (hasChanged) {
                await existing.update({
                    can_create: perm.can_create,
                    can_read: perm.can_read,
                    can_update: perm.can_update,
                    can_delete: perm.can_delete,
                });
                updatedCount++;
            }
        }

        res.json({
            success: true,
            updatedCount,
            message:
                updatedCount === 0
                    ? "No changes detected"
                    : "Permissions updated successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
