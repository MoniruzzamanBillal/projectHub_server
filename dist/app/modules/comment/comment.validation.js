"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentValidations = void 0;
const zod_1 = require("zod");
const createCommentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().min(1, "Comment content is required"),
        taskId: zod_1.z.string().uuid("Invalid task ID"),
    }),
});
exports.commentValidations = {
    createCommentValidationSchema,
};
