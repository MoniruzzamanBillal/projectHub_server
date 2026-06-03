import { Role } from "@prisma/client";
import { Router } from "express";
import validateUser from "../../middleware/validateUser";
import { activityLogController } from "./activityLog.controller";

const router = Router();

router.get(
  "/",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  activityLogController.getAllActivityLogs,
);

router.get(
  "/project/:projectId",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  activityLogController.getActivityLogsByProject,
);

router.get(
  "/task/:taskId",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  activityLogController.getActivityLogsByTask,
);

router.get(
  "/user/:userId",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  activityLogController.getActivityLogsByUser,
);

router.get(
  "/:id",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  activityLogController.getSingleActivityLog,
);

export const activityLogRouter = router;
