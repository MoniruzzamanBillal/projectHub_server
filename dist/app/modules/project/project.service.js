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
exports.projectServices = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
const createProject = (payload, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.project.create({
        data: {
            name: payload.name,
            description: payload.description,
            deadline: payload.deadline ? new Date(payload.deadline) : undefined,
            ownerId,
        },
        include: {
            owner: {
                select: { id: true, name: true, email: true },
            },
        },
    });
    yield prisma_1.default.activityLog.create({
        data: {
            action: "PROJECT_CREATED",
            description: `Project "${payload.name}" was created`,
            userId: ownerId,
            projectId: result.id,
        },
    });
    return result;
});
const getAllProjects = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, status } = query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                {
                    description: { contains: searchTerm, mode: "insensitive" },
                },
            ],
        });
    }
    if (status && status !== "all") {
        andConditions.push({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            status: status,
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.project.findMany({
        where: whereConditions,
        include: {
            owner: {
                select: { id: true, name: true, email: true },
            },
            _count: {
                select: { members: true, tasks: true },
            },
        },
        orderBy: { updatedAt: "desc" },
    });
    return result;
});
const getSingleProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.project.findUnique({
        where: { id: projectId },
        include: {
            owner: {
                select: { id: true, name: true, email: true },
            },
            members: {
                include: {
                    user: {
                        select: { id: true, name: true, email: true, role: true },
                    },
                },
            },
            tasks: {
                include: {
                    assignee: {
                        select: { id: true, name: true, email: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
            _count: {
                select: { members: true, tasks: true },
            },
        },
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    return result;
});
const updateProject = (projectId, payload, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield prisma_1.default.project.findUnique({
        where: { id: projectId },
    });
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    if (userRole !== client_1.Role.ADMIN && project.ownerId !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is not owner of this Project");
    }
    const result = yield prisma_1.default.project.update({
        where: { id: projectId },
        data: Object.assign(Object.assign({}, payload), { deadline: payload.deadline ? new Date(payload.deadline) : undefined }),
        include: {
            owner: {
                select: { id: true, name: true, email: true },
            },
        },
    });
    yield prisma_1.default.activityLog.create({
        data: {
            action: "PROJECT_UPDATED",
            description: `Project "${project.name}" was updated`,
            userId,
            projectId,
        },
    });
    return result;
});
const deleteProject = (projectId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield prisma_1.default.project.findUnique({
        where: { id: projectId },
    });
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    yield prisma_1.default.activityLog.create({
        data: {
            action: "PROJECT_DELETED",
            description: `Project "${project.name}" was deleted`,
            userId,
            projectId,
        },
    });
    yield prisma_1.default.project.delete({
        where: { id: projectId },
    });
    return { message: "Project deleted successfully" };
});
const addMember = (projectId, userId, actingUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield prisma_1.default.project.findUnique({
        where: { id: projectId },
    });
    if (!project) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Project not found");
    }
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const existingMembership = yield prisma_1.default.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId } },
    });
    if (existingMembership) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "User is already a member");
    }
    const result = yield prisma_1.default.projectMember.create({
        data: { projectId, userId },
        include: {
            user: {
                select: { id: true, name: true, email: true, role: true },
            },
        },
    });
    yield prisma_1.default.activityLog.create({
        data: {
            action: "MEMBER_ADDED",
            description: `Member "${user.name}" was added to project "${project.name}"`,
            userId: actingUserId,
            projectId,
        },
    });
    return result;
});
const removeMember = (projectId, userId, actingUserId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const membership = yield prisma_1.default.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId } },
    });
    if (!membership) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Membership not found");
    }
    const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    const project = yield prisma_1.default.project.findUnique({
        where: { id: projectId },
    });
    yield prisma_1.default.activityLog.create({
        data: {
            action: "MEMBER_REMOVED",
            description: `Member "${(_a = user === null || user === void 0 ? void 0 : user.name) !== null && _a !== void 0 ? _a : userId}" was removed from project "${(_b = project === null || project === void 0 ? void 0 : project.name) !== null && _b !== void 0 ? _b : projectId}"`,
            userId: actingUserId,
            projectId,
        },
    });
    yield prisma_1.default.projectMember.delete({
        where: { projectId_userId: { projectId, userId } },
    });
    return { message: "Member removed successfully" };
});
exports.projectServices = {
    createProject,
    getAllProjects,
    getSingleProject,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
};
