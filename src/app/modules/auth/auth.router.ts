import { Router } from "express";
import { authController } from "./auth.controller";

import validateRequest from "../../middleware/validateRequest";
import { userValidations } from "../user/user.validation";
import validateUser from "../../middleware/validateUser";
import { Role } from "@prisma/client";

const router = Router();

router.post(
  "/login",
  validateRequest(userValidations.loginValidationSchema),
  authController.signIn,
);

router.post(
  "/signup",

  validateRequest(userValidations.createUserValidationSchema),
  authController.crateUser,
);

router.patch(
  "/update-user",

  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  authController.updateUser,
);

router.patch(
  "/delete-user",
  validateUser(Role.ADMIN),
  authController.deleteUser,
);

export const authRouter = router;
