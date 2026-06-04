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
exports.activityLogServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
const createActivityLog = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield prisma_1.default.activityLog.create({
        data: {
            action: payload.action,
            description: payload.description,
            userId: payload.userId,
            projectId: payload.projectId,
            taskId: payload.taskId,
            metadata: ((_a = payload.metadata) !== null && _a !== void 0 ? _a : undefined),
        },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
        },
    });
    return result;
});
const getAllActivityLogs = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const where = {};
    if (query.action) {
        where.action = query.action;
    }
    if (query.userId) {
        where.userId = query.userId;
    }
    if (query.projectId) {
        where.projectId = query.projectId;
    }
    const result = yield prisma_1.default.activityLog.findMany({
        where,
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
            project: {
                select: { id: true, name: true },
            },
            task: {
                select: { id: true, title: true },
            },
        },
        orderBy: { createdAt: "desc" },
        take: 15,
    });
    return result;
});
const getActivityLogsByProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield prisma_1.default.project.findUnique({
        where: { id: projectId },
    });
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    const result = yield prisma_1.default.activityLog.findMany({
        where: { projectId },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
            task: {
                select: { id: true, title: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const getActivityLogsByTask = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield prisma_1.default.task.findUnique({
        where: { id: taskId },
    });
    if (!task) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Task not found");
    }
    const result = yield prisma_1.default.activityLog.findMany({
        where: { taskId },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const getActivityLogsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const result = yield prisma_1.default.activityLog.findMany({
        where: { userId },
        include: {
            project: {
                select: { id: true, name: true },
            },
            task: {
                select: { id: true, title: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const getSingleActivityLog = (logId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.activityLog.findUnique({
        where: { id: logId },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
            project: {
                select: { id: true, name: true },
            },
            task: {
                select: { id: true, title: true },
            },
        },
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Activity log not found");
    }
    return result;
});
exports.activityLogServices = {
    createActivityLog,
    getAllActivityLogs,
    getActivityLogsByProject,
    getActivityLogsByTask,
    getActivityLogsByUser,
    getSingleActivityLog,
};
