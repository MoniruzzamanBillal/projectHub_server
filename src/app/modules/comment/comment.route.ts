import { Router } from "express";
import { Role } from "@prisma/client";
import validateRequest from "../../middleware/validateRequest";
import validateUser from "../../middleware/validateUser";
import { commentController } from "./comment.controller";
import { commentValidations } from "./comment.validation";

const router = Router();

router.post(
  "/",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  validateRequest(commentValidations.createCommentValidationSchema),
  commentController.createComment,
);

router.get(
  "/task/:taskId",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  commentController.getCommentsByTask,
);

router.delete(
  "/:id",
  validateUser(Role.ADMIN, Role.PROJECT_MANAGER, Role.TEAM_MEMBER),
  commentController.deleteComment,
);

export const commentRouter = router;
