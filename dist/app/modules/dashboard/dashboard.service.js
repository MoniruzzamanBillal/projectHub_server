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
exports.dashboardServices = void 0;
const prisma_1 = __importDefault(require("../../util/prisma"));
const getDashboardStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalProjects = yield prisma_1.default.project.count();
    const activeProjects = yield prisma_1.default.project.count({
        where: { status: "ACTIVE" },
    });
    const totalTasks = yield prisma_1.default.task.count();
    const completedTasks = yield prisma_1.default.task.count({
        where: { status: "COMPLETED" },
    });
    const overdueTasks = yield prisma_1.default.task.count({
        where: {
            dueDate: { lt: new Date() },
            status: { not: "COMPLETED" },
        },
    });
    const teamMembers = yield prisma_1.default.user.count();
    const priorityDistribution = yield prisma_1.default.task.groupBy({
        by: ["priority"],
        _count: true,
    });
    const tasksByAssignee = yield prisma_1.default.task.groupBy({
        by: ["assigneeId"],
        _count: true,
    });
    const assigneeIds = tasksByAssignee.map((t) => t.assigneeId);
    const users = yield prisma_1.default.user.findMany({
        where: { id: { in: assigneeIds } },
        select: { id: true, name: true },
    });
    const userTaskMap = new Map(users.map((u) => [u.id, u.name]));
    const maxTasks = Math.max(...tasksByAssignee.map((t) => t._count), 1);
    const teamWorkload = tasksByAssignee.map((t) => {
        var _a;
        return ({
            name: (_a = userTaskMap.get(t.assigneeId)) !== null && _a !== void 0 ? _a : "Unknown",
            tasks: t._count,
            percentage: Math.round((t._count / maxTasks) * 100),
        });
    });
    return {
        kpis: {
            totalProjects,
            activeProjects,
            totalTasks,
            completedTasks,
            overdueTasks,
            teamMembers,
        },
        priorityDistribution: priorityDistribution.map((p) => ({
            priority: p.priority,
            count: p._count,
        })),
        teamWorkload,
    };
});
exports.dashboardServices = { getDashboardStats };
