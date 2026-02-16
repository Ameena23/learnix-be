import express from "express";
import {
    getAllModules,
    getPermissionsByRole,
    updatePermission,
    getUserPermissions,
    bulkUpdatePermissions      // ✅ ADD THIS
} from "./rbac.controller.js";
import checkPermission from "../../utils/rbacMiddleware.js";

const router = express.Router();

// Publicly available to authenticated users to know their own permissions
router.get("/my-permissions", getUserPermissions);

// Admin-only routes
router.get(
    "/modules",
    checkPermission("user_management", "read"),
    getAllModules
);

router.get(
    "/permissions/:role",
    checkPermission("user_management", "read"),
    getPermissionsByRole
);

router.post(
    "/permissions/update",
    checkPermission("user_management", "update"),
    updatePermission
);

// ✅ ADD THIS ROUTE
router.post(
    "/permissions/bulk-update",
    checkPermission("user_management", "update"),
    bulkUpdatePermissions
);

export default router;
