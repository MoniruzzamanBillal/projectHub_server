"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogValidations = void 0;
const zod_1 = require("zod");
const activityLogFilterValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        projectId: zod_1.z.string().uuid().optional(),
        taskId: zod_1.z.string().uuid().optional(),
        userId: zod_1.z.string().uuid().optional(),
        action: zod_1.z
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
exports.activityLogValidations = {
    activityLogFilterValidationSchema,
};
