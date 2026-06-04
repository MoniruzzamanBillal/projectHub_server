"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const validateUser_1 = __importDefault(require("../../middleware/validateUser"));
const comment_controller_1 = require("./comment.controller");
const comment_validation_1 = require("./comment.validation");
const router = (0, express_1.Router)();
router.post("/", (0, validateUser_1.default)(client_1.Role.ADMIN, client_1.Role.PROJECT_MANAGER, client_1.Role.TEAM_MEMBER), (0, validateRequest_1.default)(comment_validation_1.commentValidations.createCommentValidationSchema), comment_controller_1.commentController.createComment);
router.get("/task/:taskId", (0, validateUser_1.default)(client_1.Role.ADMIN, client_1.Role.PROJECT_MANAGER, client_1.Role.TEAM_MEMBER), comment_controller_1.commentController.getCommentsByTask);
router.delete("/:id", (0, validateUser_1.default)(client_1.Role.ADMIN, client_1.Role.PROJECT_MANAGER, client_1.Role.TEAM_MEMBER), comment_controller_1.commentController.deleteComment);
exports.commentRouter = router;
