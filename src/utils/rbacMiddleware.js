import Permission from "../models/Permission.model.js";
import UsersList from "../models/UsersDetails.model.js";

const checkPermission = (moduleName, action) => {
    return async (req, res, next) => {
        try {
            // In a real app, you'd get the user from a JWT token.
            // Here we'll use X-User-Id or similar for demonstration if JWT isn't fully set up.
            const userId = req.headers['x-user-id'];
            let userRole = req.headers['x-user-role'];

            if (!userRole && userId) {
                const user = await UsersList.findByPk(userId);
                if (user) {
                    userRole = user.role;
                }
            }

            if (!userRole) {
                return res.status(401).json({ success: false, message: "Unauthorized: No role found" });
            }

            // Admin bypasses all checks
            if (userRole === 'admin') {
                return next();
            }

            const permission = await Permission.findOne({
                where: {
                    role: userRole,
                    moduleName: moduleName
                }
            });

            if (!permission) {
                return res.status(403).json({ success: false, message: "Forbidden: No permission for this module" });
            }

            let hasAccess = false;
            switch (action) {
                case 'create':
                    hasAccess = permission.can_create;
                    break;
                case 'read':
                    hasAccess = permission.can_read;
                    break;
                case 'update':
                    hasAccess = permission.can_update;
                    break;
                case 'delete':
                    hasAccess = permission.can_delete;
                    break;
                default:
                    hasAccess = false;
            }

            if (hasAccess) {
                return next();
            } else {
                return res.status(403).json({ success: false, message: `Forbidden: No ${action} permission for ${moduleName}` });
            }

        } catch (error) {
            console.error("RBAC Middleware Error:", error);
            res.status(500).json({ success: false, message: "Internal Server Error in RBAC" });
        }
    };
};

export default checkPermission;
