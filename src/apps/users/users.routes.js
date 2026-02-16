import { Router } from "express";
import { createUsersDetails } from "./users.controller.js";


import checkPermission from "../../utils/rbacMiddleware.js";

const router = Router();

router.post("/create", checkPermission('user_management', 'create'), createUsersDetails);

export default router;