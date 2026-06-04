"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const validateUser_1 = __importDefault(require("../../middleware/validateUser"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.get("/all-user", (0, validateUser_1.default)(client_1.Role.ADMIN), user_controller_1.userController.getAllUsers);
router.get("/team", (0, validateUser_1.default)(client_1.Role.ADMIN, client_1.Role.PROJECT_MANAGER, client_1.Role.TEAM_MEMBER), user_controller_1.userController.getAllUsersForTeam);
router.get("/logged-user", (0, validateUser_1.default)(client_1.Role.ADMIN, client_1.Role.PROJECT_MANAGER, client_1.Role.TEAM_MEMBER), user_controller_1.userController.getLoggedInUser);
router.patch("/:userId/role", (0, validateUser_1.default)(client_1.Role.ADMIN), (0, validateRequest_1.default)(user_validation_1.userValidations.updateUserRoleValidationSchema), user_controller_1.userController.updateUserRole);
exports.userRouter = router;
