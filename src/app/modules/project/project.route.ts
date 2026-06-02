import { Router } from "express";
import { Role } from "@prisma/client";
import validateRequest from "../../middleware/validateRequest";
import validateUser from "../../middleware/validateUser";
import { projectController } from "./project.controller";
import { projectValidations } from "./project.validation";

const router = Router();

router.post(
  "/",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER),
  validateRequest(projectValidations.createProjectValidationSchema),
  projectController.createProject,
);

router.get(
  "/",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  projectController.getAllProjects,
);

router.get(
  "/:id",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  projectController.getSingleProject,
);

router.patch(
  "/:id",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER),
  validateRequest(projectValidations.updateProjectValidationSchema),
  projectController.updateProject,
);

router.delete(
  "/:id",
  validateUser(Role.ADMIN),
  projectController.deleteProject,
);

router.post(
  "/:id/members",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER),
  projectController.addMember,
);

router.delete(
  "/:id/members/:memberId",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER),
  projectController.removeMember,
);

export const projectRouter = router;
