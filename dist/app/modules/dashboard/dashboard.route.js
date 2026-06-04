"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRouter = void 0;
const express_1 = require("express");
const validateUser_1 = __importDefault(require("../../middleware/validateUser"));
const client_1 = require("@prisma/client");
const dashboard_controller_1 = require("./dashboard.controller");
const router = (0, express_1.Router)();
router.get("/", (0, validateUser_1.default)(client_1.Role.ADMIN, client_1.Role.PROJECT_MANAGER, client_1.Role.TEAM_MEMBER), dashboard_controller_1.dashboardController.getDashboardStats);
exports.dashboardRouter = router;
