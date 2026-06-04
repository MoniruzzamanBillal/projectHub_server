"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskValidations = void 0;
const zod_1 = require("zod");
const createTaskValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Task title is required"),
        description: zod_1.z.string().optional(),
        dueDate: zod_1.z.string().datetime().optional(),
        priority: zod_1.z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
        status: zod_1.z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
        projectId: zod_1.z.string().uuid("Invalid project ID"),
        assigneeId: zod_1.z.string().uuid("Invalid assignee ID"),
    }),
});
const updateTaskValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().optional(),
        dueDate: zod_1.z.string().datetime().optional(),
        priority: zod_1.z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
        status: zod_1.z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
        assigneeId: zod_1.z.string().uuid().optional(),
    }),
});
exports.taskValidations = {
    createTaskValidationSchema,
    updateTaskValidationSchema,
};
