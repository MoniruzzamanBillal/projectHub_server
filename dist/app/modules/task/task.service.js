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
exports.taskServices = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
const validateDueDate = (dueDate) => {
    if (!dueDate)
        return undefined;
    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please select a valid deadline.");
    }
    return date;
};
const createTask = (payload, creatorId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield prisma_1.default.project.findUnique({
        where: { id: payload.projectId },
    });
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    const assignee = yield prisma_1.default.user.findUnique({
        where: { id: payload.assigneeId },
    });
    if (!assignee) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Assignee not found");
    }
    const existingTask = yield prisma_1.default.task.findUnique({
        where: {
            projectId_title: { projectId: payload.projectId, title: payload.title },
        },
    });
    if (existingTask) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "This task already exists in the project.");
    }
    const validatedDueDate = validateDueDate(payload.dueDate);
    const result = yield prisma_1.default.task.create({
        data: {
            title: payload.title,
            description: payload.description,
            dueDate: validatedDueDate,
            priority: payload.priority,
            status: payload.status,
            projectId: payload.projectId,
            assigneeId: payload.assigneeId,
            creatorId,
        },
        include: {
            project: {
                select: { id: true, name: true },
            },
            assignee: {
                select: { id: true, name: true, email: true },
            },
            creator: {
                select: { id: true, name: true, email: true },
            },
        },
    });
    yield prisma_1.default.activityLog.create({
        data: {
            action: "TASK_CREATED",
            description: `Task "${payload.title}" was created`,
            userId: creatorId,
            projectId: payload.projectId,
            taskId: result.id,
        },
    });
    return result;
});
const getAllTasks = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const where = {};
    if (query.searchTerm) {
        where.title = { contains: query.searchTerm, mode: "insensitive" };
    }
    if (query.status) {
        where.status = query.status;
    }
    if (query.priority) {
        where.priority = query.priority;
    }
    const result = yield prisma_1.default.task.findMany({
        where,
        include: {
            project: {
                select: { id: true, name: true },
            },
            assignee: {
                select: { id: true, name: true, email: true },
            },
            creator: {
                select: { id: true, name: true, email: true },
            },
            _count: {
                select: { comments: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const getMyTasks = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const where = { assigneeId: userId };
    if (query.searchTerm) {
        where.title = { contains: query.searchTerm, mode: "insensitive" };
    }
    if (query.status) {
        where.status = query.status;
    }
    if (query.priority) {
        where.priority = query.priority;
    }
    const result = yield prisma_1.default.task.findMany({
        where,
        include: {
            project: {
                select: { id: true, name: true },
            },
            assignee: {
                select: { id: true, name: true, email: true },
            },
            creator: {
                select: { id: true, name: true, email: true },
            },
            _count: {
                select: { comments: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const getTasksByProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield prisma_1.default.project.findUnique({
        where: { id: projectId },
    });
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    const result = yield prisma_1.default.task.findMany({
        where: { projectId },
        include: {
            assignee: {
                select: { id: true, name: true, email: true },
            },
            creator: {
                select: { id: true, name: true, email: true },
            },
            _count: {
                select: { comments: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const getSingleTask = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.task.findUnique({
        where: { id: taskId },
        include: {
            project: {
                select: { id: true, name: true },
            },
            assignee: {
                select: { id: true, name: true, email: true },
            },
            creator: {
                select: { id: true, name: true, email: true },
            },
            comments: {
                include: {
                    author: {
                        select: { id: true, name: true, email: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Task not found");
    }
    return result;
});
const updateTask = (taskId, payload, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield prisma_1.default.task.findUnique({
        where: { id: taskId },
    });
    if (!task) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Task not found");
    }
    if (userRole === client_1.Role.TEAM_MEMBER && task.assigneeId !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You can only update tasks assigned to you");
    }
    if (userRole === client_1.Role.TEAM_MEMBER) {
        const allowed = ["status"];
        const extra = Object.keys(payload).filter((k) => !allowed.includes(k));
        if (extra.length > 0) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Team members can only update task status");
        }
    }
    if (payload.assigneeId &&
        payload.assigneeId !== task.assigneeId &&
        task.status === "COMPLETED") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Completed tasks cannot be reassigned.");
    }
    if (payload.title) {
        const existingTask = yield prisma_1.default.task.findUnique({
            where: {
                projectId_title: { projectId: task.projectId, title: payload.title },
            },
        });
        if (existingTask && existingTask.id !== taskId) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, "This task already exists in the project.");
        }
    }
    const validatedDueDate = validateDueDate(payload.dueDate);
    const result = yield prisma_1.default.task.update({
        where: { id: taskId },
        data: Object.assign(Object.assign({}, payload), { dueDate: validatedDueDate }),
        include: {
            project: {
                select: { id: true, name: true },
            },
            assignee: {
                select: { id: true, name: true, email: true },
            },
        },
    });
    const action = payload.status && payload.status !== task.status
        ? "TASK_STATUS_CHANGED"
        : "TASK_UPDATED";
    const description = payload.status && payload.status !== task.status
        ? `Task "${task.title}" status changed to ${payload.status.replace("_", " ")}`
        : `Task "${task.title}" was updated`;
    yield prisma_1.default.activityLog.create({
        data: {
            action,
            description,
            userId,
            projectId: task.projectId,
            taskId,
        },
    });
    return result;
});
const deleteTask = (taskId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield prisma_1.default.task.findUnique({
        where: { id: taskId },
    });
    if (!task) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Task not found");
    }
    yield prisma_1.default.activityLog.create({
        data: {
            action: "TASK_DELETED",
            description: `Task "${task.title}" was deleted`,
            userId,
            projectId: task.projectId,
            taskId,
        },
    });
    yield prisma_1.default.task.delete({
        where: { id: taskId },
    });
    return { message: "Task deleted successfully" };
});
exports.taskServices = {
    createTask,
    getAllTasks,
    getMyTasks,
    getTasksByProject,
    getSingleTask,
    updateTask,
    deleteTask,
};
