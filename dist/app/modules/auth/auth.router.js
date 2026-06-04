"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("../user/user.validation");
const validateUser_1 = __importDefault(require("../../middleware/validateUser"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/login", (0, validateRequest_1.default)(user_validation_1.userValidations.loginValidationSchema), auth_controller_1.authController.signIn);
router.post("/signup", (0, validateRequest_1.default)(user_validation_1.userValidations.createUserValidationSchema), auth_controller_1.authController.crateUser);
router.patch("/update-user", (0, validateUser_1.default)(client_1.Role.ADMIN, client_1.Role.PROJECT_MANAGER, client_1.Role.TEAM_MEMBER), auth_controller_1.authController.updateUser);
router.patch("/delete-user", (0, validateUser_1.default)(client_1.Role.ADMIN), auth_controller_1.authController.deleteUser);
exports.authRouter = router;
