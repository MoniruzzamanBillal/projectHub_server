import { Role } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";
import { TCreateTask, TUpdateTask } from "./task.interface";

const createTask = async (payload: TCreateTask, creatorId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: payload.projectId },
  });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const assignee = await prisma.user.findUnique({
    where: { id: payload.assigneeId },
  });

  if (!assignee) {
    throw new AppError(httpStatus.NOT_FOUND, "Assignee not found");
  }

  const existingTask = await prisma.task.findUnique({
    where: {
      projectId_title: { projectId: payload.projectId, title: payload.title },
    },
  });

  if (existingTask) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A task with this title already exists in the project",
    );
  }

  const result = await prisma.task.create({
    data: {
      title: payload.title,
      description: payload.description,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
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

  return result;
};

const getAllTasks = async () => {
  const result = await prisma.task.findMany({
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
};

const getTasksByProject = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const result = await prisma.task.findMany({
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
};

const getSingleTask = async (taskId: string) => {
  const result = await prisma.task.findUnique({
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
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  return result;
};

const updateTask = async (
  taskId: string,
  payload: TUpdateTask,
  userId: string,
  userRole: string,
) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  if (userRole === Role.TEAM_MEMBER && task.assigneeId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only update tasks assigned to you",
    );
  }

  if (payload.title) {
    const existingTask = await prisma.task.findUnique({
      where: {
        projectId_title: { projectId: task.projectId, title: payload.title },
      },
    });

    if (existingTask && existingTask.id !== taskId) {
      throw new AppError(
        httpStatus.CONFLICT,
        "A task with this title already exists in the project",
      );
    }
  }

  const result = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...payload,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    },
    include: {
      project: {
        select: { id: true, name: true },
      },
      assignee: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return result;
};

const deleteTask = async (taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return { message: "Task deleted successfully" };
};

export const taskServices = {
  createTask,
  getAllTasks,
  getTasksByProject,
  getSingleTask,
  updateTask,
  deleteTask,
};
