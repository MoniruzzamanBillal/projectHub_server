import { Router } from "express";
import { Role } from "@prisma/client";
import validateRequest from "../../middleware/validateRequest";
import validateUser from "../../middleware/validateUser";
import { taskController } from "./task.controller";
import { taskValidations } from "./task.validation";

const router = Router();

router.post(
  "/",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER),
  validateRequest(taskValidations.createTaskValidationSchema),
  taskController.createTask,
);

router.get(
  "/",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  taskController.getAllTasks,
);

router.get(
  "/project/:projectId",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  taskController.getTasksByProject,
);

router.get(
  "/:id",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  taskController.getSingleTask,
);

router.patch(
  "/:id",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  validateRequest(taskValidations.updateTaskValidationSchema),
  taskController.updateTask,
);

router.delete(
  "/:id",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER),
  taskController.deleteTask,
);

export const taskRouter = router;
