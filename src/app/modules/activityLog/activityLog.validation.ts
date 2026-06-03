import { z } from "zod";

const activityLogFilterValidationSchema = z.object({
  body: z.object({
    projectId: z.string().uuid().optional(),
    taskId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    action: z
      .enum([
        "PROJECT_CREATED",
        "PROJECT_UPDATED",
        "PROJECT_DELETED",
        "TASK_CREATED",
        "TASK_UPDATED",
        "TASK_DELETED",
        "TASK_ASSIGNED",
        "TASK_STATUS_CHANGED",
        "MEMBER_ADDED",
        "MEMBER_REMOVED",
        "COMMENT_ADDED",
      ])
      .optional(),
  }),
});

export const activityLogValidations = {
  activityLogFilterValidationSchema,
};
