"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectValidations = void 0;
const zod_1 = require("zod");
const createProjectValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Project name is required"),
        description: zod_1.z.string().optional(),
        deadline: zod_1.z.string().datetime().optional(),
        status: zod_1.z.enum(["ACTIVE", "COMPLETED", "ON_HOLD"]).optional(),
    }),
});
const updateProjectValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().optional(),
        deadline: zod_1.z.string().datetime().optional(),
        status: zod_1.z.enum(["ACTIVE", "COMPLETED", "ON_HOLD"]).optional(),
    }),
});
exports.projectValidations = {
    createProjectValidationSchema,
    updateProjectValidationSchema,
};
