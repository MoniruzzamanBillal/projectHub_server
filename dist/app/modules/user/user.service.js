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
exports.userServices = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({
        where: {
            role: {
                in: [client_1.Role.TEAM_MEMBER, client_1.Role.PROJECT_MANAGER],
            },
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
    return result;
});
const getAllUsersForTeam = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({
        orderBy: {
            updatedAt: "desc",
        },
    });
    return result;
});
const getLoggedInUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist");
    }
    return result;
});
const handleUpdaeProfile = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.update({
        where: { id: userId },
        data: payload,
    });
    return result;
});
const updateUserRole = (targetUserId, newRole, actingUserId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const targetUser = yield prisma_1.default.user.findUnique({
        where: { id: targetUserId },
    });
    if (!targetUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (targetUser.id === actingUserId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You cannot change your own role");
    }
    if (targetUser.role === client_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cannot change another admin's role");
    }
    const actingUser = yield prisma_1.default.user.findUnique({
        where: { id: actingUserId },
    });
    const result = yield prisma_1.default.user.update({
        where: { id: targetUserId },
        data: { role: newRole },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    yield prisma_1.default.activityLog.create({
        data: {
            action: "USER_ROLE_CHANGED",
            description: `${(_a = actingUser === null || actingUser === void 0 ? void 0 : actingUser.name) !== null && _a !== void 0 ? _a : "Admin"} changed role of ${targetUser.name} from ${targetUser.role} to ${newRole}`,
            userId: actingUserId,
        },
    });
    return result;
});
exports.userServices = {
    getAllUsers,
    getAllUsersForTeam,
    getLoggedInUser,
    handleUpdaeProfile,
    updateUserRole,
};
