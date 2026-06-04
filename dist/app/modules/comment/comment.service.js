"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentServices = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
const createComment = (payload, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield prisma_1.default.task.findUnique({
        where: { id: payload.taskId },
    });
    if (!task) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Task not found");
    }
    const result = yield prisma_1.default.comment.create({
        data: {
            content: payload.content,
            taskId: payload.taskId,
            authorId,
        },
        include: {
            author: {
                select: { id: true, name: true, email: true },
            },
        },
    });
    yield prisma_1.default.activityLog.create({
        data: {
            action: "COMMENT_ADDED",
            description: `Comment added to task "${task.title}"`,
            userId: authorId,
            projectId: task.projectId,
            taskId: payload.taskId,
        },
    });
    return result;
});
const getCommentsByTask = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield prisma_1.default.task.findUnique({
        where: { id: taskId },
    });
    if (!task) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Task not found");
    }
    const result = yield prisma_1.default.comment.findMany({
        where: { taskId },
        include: {
            author: {
                select: { id: true, name: true, email: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const deleteComment = (commentId, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield prisma_1.default.comment.findUnique({
        where: { id: commentId },
    });
    if (!comment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Comment not found");
    }
    if (userRole === client_1.Role.TEAM_MEMBER && comment.authorId !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You can only delete your own comments");
    }
    yield prisma_1.default.comment.delete({
        where: { id: commentId },
    });
    return { message: "Comment deleted successfully" };
});
exports.commentServices = {
    createComment,
    getCommentsByTask,
    deleteComment,
};
