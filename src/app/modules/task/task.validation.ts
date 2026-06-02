import { z } from "zod";

const createTaskValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Task title is required"),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
    projectId: z.string().uuid("Invalid project ID"),
    assigneeId: z.string().uuid("Invalid assignee ID"),
  }),
});

const updateTaskValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
    assigneeId: z.string().uuid().optional(),
  }),
});

export const taskValidations = {
  createTaskValidationSchema,
  updateTaskValidationSchema,
};
