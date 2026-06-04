"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const validateUser_1 = __importDefault(require("../../middleware/validateUser"));
const activityLog_controller_1 = require("./activityLog.controller");
const router = (0, express_1.Router)();
router.get("/", (0, validateUser_1.default)(client_1.Role.ADMIN, client_1.Role.PROJECT_MANAGER, client_1.Role.TEAM_MEMBER), activityLog_controller_1.activityLogController.getAllActivityLogs);
router.get("/project/:projectId", (0, validateUser_1.default)(client_1.Role.ADMIN, client_1.Role.PROJECT_MANAGER, client_1.Role.TEAM_MEMBER), activityLog_controller_1.activityLogController.getActivityLogsByProject);
router.get("/task/:taskId", (0, validateUser_1.default)(client_1.Role.ADMIN, client_1.Role.PROJECT_MANAGER, client_1.Role.TEAM_MEMBER), activityLog_controller_1.activityLogController.getActivityLogsByTask);
router.get("/user/:userId", (0, validateUser_1.default)(client_1.Role.ADMIN, client_1.Role.PROJECT_MANAGER, client_1.Role.TEAM_MEMBER), activityLog_controller_1.activityLogController.getActivityLogsByUser);
router.get("/:id", (0, validateUser_1.default)(client_1.Role.ADMIN, client_1.Role.PROJECT_MANAGER, client_1.Role.TEAM_MEMBER), activityLog_controller_1.activityLogController.getSingleActivityLog);
exports.activityLogRouter = router;
