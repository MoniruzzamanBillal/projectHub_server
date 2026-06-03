import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";
import { TCreateActivityLog } from "./activityLog.interface";

const createActivityLog = async (payload: TCreateActivityLog) => {
  const result = await prisma.activityLog.create({
    data: {
      action: payload.action,
      description: payload.description,
      userId: payload.userId,
      projectId: payload.projectId,
      taskId: payload.taskId,
      metadata: (payload.metadata ?? undefined) as Prisma.InputJsonValue,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return result;
};

const getAllActivityLogs = async (query: {
  action?: string;
  userId?: string;
  projectId?: string;
}) => {
  const where: Prisma.ActivityLogWhereInput = {};

  if (query.action) {
    where.action = query.action as Prisma.EnumActivityActionFilter["equals"];
  }
  if (query.userId) {
    where.userId = query.userId;
  }
  if (query.projectId) {
    where.projectId = query.projectId;
  }

  const result = await prisma.activityLog.findMany({
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
};

const getActivityLogsByProject = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const result = await prisma.activityLog.findMany({
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
};

const getActivityLogsByTask = async (taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  const result = await prisma.activityLog.findMany({
    where: { taskId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getActivityLogsByUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.activityLog.findMany({
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
};

const getSingleActivityLog = async (logId: string) => {
  const result = await prisma.activityLog.findUnique({
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
    throw new AppError(httpStatus.NOT_FOUND, "Activity log not found");
  }

  return result;
};

export const activityLogServices = {
  createActivityLog,
  getAllActivityLogs,
  getActivityLogsByProject,
  getActivityLogsByTask,
  getActivityLogsByUser,
  getSingleActivityLog,
};
