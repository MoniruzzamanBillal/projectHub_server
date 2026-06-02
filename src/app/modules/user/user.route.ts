import { Router } from "express";
import validateUser from "../../middleware/validateUser";
import { Role } from "@prisma/client";
import { userController } from "./user.controller";

const router = Router();

router.get("/all-user", validateUser(Role.ADMIN), userController.getAllUsers);

router.get(
  "/logged-user",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  userController.getLoggedInUser,
);

export const userRouter = router;
