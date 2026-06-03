import { Role } from "@prisma/client";
import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import validateUser from "../../middleware/validateUser";
import { userController } from "./user.controller";
import { userValidations } from "./user.validation";

const router = Router();

router.get("/all-user", validateUser(Role.ADMIN), userController.getAllUsers);

router.get(
  "/team",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  userController.getAllUsersForTeam,
);

router.get(
  "/logged-user",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  userController.getLoggedInUser,
);

router.patch(
  "/:userId/role",
  validateUser(Role.ADMIN),
  validateRequest(userValidations.updateUserRoleValidationSchema),
  userController.updateUserRole,
);

export const userRouter = router;
