"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainRouter = void 0;
const express_1 = require("express");
const activityLog_route_1 = require("../modules/activityLog/activityLog.route");
const auth_router_1 = require("../modules/auth/auth.router");
const comment_route_1 = require("../modules/comment/comment.route");
const dashboard_route_1 = require("../modules/dashboard/dashboard.route");
const project_route_1 = require("../modules/project/project.route");
const task_route_1 = require("../modules/task/task.route");
const user_route_1 = require("../modules/user/user.route");
const router = (0, express_1.Router)();
const routeArray = [
    {
        path: "/auth",
        route: auth_router_1.authRouter,
    },
    {
        path: "/user",
        route: user_route_1.userRouter,
    },
    {
        path: "/projects",
        route: project_route_1.projectRouter,
    },
    {
        path: "/tasks",
        route: task_route_1.taskRouter,
    },
    {
        path: "/comments",
        route: comment_route_1.commentRouter,
    },
    {
        path: "/activity-logs",
        route: activityLog_route_1.activityLogRouter,
    },
    {
        path: "/dashboard",
        route: dashboard_route_1.dashboardRouter,
    },
];
routeArray.forEach((item) => {
    router.use(item.path, item.route);
});
exports.MainRouter = router;
