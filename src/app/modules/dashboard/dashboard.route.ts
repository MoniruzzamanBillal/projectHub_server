import { Router } from "express";
import validateUser from "../../middleware/validateUser";
import { Role } from "@prisma/client";
import { dashboardController } from "./dashboard.controller";

const router = Router();

router.get(
  "/",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  dashboardController.getDashboardStats,
);

export const dashboardRouter = router;
