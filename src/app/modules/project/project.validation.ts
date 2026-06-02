import { z } from "zod";

const createProjectValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional(),
    deadline: z.string().datetime().optional(),
    status: z.enum(["ACTIVE", "COMPLETED", "ON_HOLD"]).optional(),
  }),
});

const updateProjectValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    deadline: z.string().datetime().optional(),
    status: z.enum(["ACTIVE", "COMPLETED", "ON_HOLD"]).optional(),
  }),
});

export const projectValidations = {
  createProjectValidationSchema,
  updateProjectValidationSchema,
};
