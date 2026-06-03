import { Router } from "express";

// import { activityLogRouter } from "../modules/activityLog/activityLog.route";
import { authRouter } from "../modules/auth/auth.router";
import { commentRouter } from "../modules/comment/comment.route";
import { dashboardRouter } from "../modules/dashboard/dashboard.route";
import { projectRouter } from "../modules/project/project.route";
import { taskRouter } from "../modules/task/task.route";
import { userRouter } from "../modules/user/user.route";

const router = Router();

const routeArray = [
  {
    path: "/auth",
    route: authRouter,
  },

  {
    path: "/user",
    route: userRouter,
  },

  {
    path: "/projects",
    route: projectRouter,
  },

  {
    path: "/tasks",
    route: taskRouter,
  },

  {
    path: "/comments",
    route: commentRouter,
  },

  // {
  //   path: "/activity-logs",
  //   route: activityLogRouter,
  // },

  {
    path: "/dashboard",
    route: dashboardRouter,
  },
];

routeArray.forEach((item) => {
  router.use(item.path, item.route);
});

export const MainRouter = router;
