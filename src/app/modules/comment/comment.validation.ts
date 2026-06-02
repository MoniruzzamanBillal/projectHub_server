import { z } from "zod";

const createCommentValidationSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Comment content is required"),
    taskId: z.string().uuid("Invalid task ID"),
  }),
});

export const commentValidations = {
  createCommentValidationSchema,
};
