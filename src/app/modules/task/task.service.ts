import { Prisma, Role, TaskPriority, TaskStatus } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";
import { TCreateTask, TUpdateTask } from "./task.interface";

const validateDueDate = (dueDate: string | undefined): Date | undefined => {
  if (!dueDate) return undefined;

  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please select a valid deadline.",
    );
  }

  return date;
};

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
      "This task already exists in the project.",
    );
  }

  const validatedDueDate = validateDueDate(payload.dueDate);

  const result = await prisma.task.create({
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

  await prisma.activityLog.create({
    data: {
      action: "TASK_CREATED",
      description: `Task "${payload.title}" was created`,
      userId: creatorId,
      projectId: payload.projectId,
      taskId: result.id,
    },
  });

  return result;
};

const getAllTasks = async (query: {
  searchTerm?: string;
  status?: string;
  priority?: string;
}) => {
  const where: Prisma.TaskWhereInput = {};

  if (query.searchTerm) {
    where.title = { contains: query.searchTerm, mode: "insensitive" };
  }
  if (query.status) {
    where.status = query.status as TaskStatus;
  }
  if (query.priority) {
    where.priority = query.priority as TaskPriority;
  }

  const result = await prisma.task.findMany({
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
};

const getMyTasks = async (
  userId: string,
  query: { searchTerm?: string; status?: string; priority?: string },
) => {
  const where: Prisma.TaskWhereInput = { assigneeId: userId };

  if (query.searchTerm) {
    where.title = { contains: query.searchTerm, mode: "insensitive" };
  }
  if (query.status) {
    where.status = query.status as TaskStatus;
  }
  if (query.priority) {
    where.priority = query.priority as TaskPriority;
  }

  const result = await prisma.task.findMany({
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

  if (userRole === Role.TEAM_MEMBER) {
    const allowed = ["status"];
    const extra = Object.keys(payload).filter((k) => !allowed.includes(k));
    if (extra.length > 0) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Team members can only update task status",
      );
    }
  }

  if (
    payload.assigneeId &&
    payload.assigneeId !== task.assigneeId &&
    task.status === "COMPLETED"
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Completed tasks cannot be reassigned.",
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
        "This task already exists in the project.",
      );
    }
  }

  const validatedDueDate = validateDueDate(payload.dueDate);

  const result = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...payload,
      dueDate: validatedDueDate,
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

  const action =
    payload.status && payload.status !== task.status
      ? "TASK_STATUS_CHANGED"
      : "TASK_UPDATED";
  const description =
    payload.status && payload.status !== task.status
      ? `Task "${task.title}" status changed to ${payload.status.replace("_", " ")}`
      : `Task "${task.title}" was updated`;

  await prisma.activityLog.create({
    data: {
      action,
      description,
      userId,
      projectId: task.projectId,
      taskId,
    },
  });

  return result;
};

const deleteTask = async (taskId: string, userId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  await prisma.activityLog.create({
    data: {
      action: "TASK_DELETED",
      description: `Task "${task.title}" was deleted`,
      userId,
      projectId: task.projectId,
      taskId,
    },
  });

  await prisma.task.delete({
    where: { id: taskId },
  });

  return { message: "Task deleted successfully" };
};

export const taskServices = {
  createTask,
  getAllTasks,
  getMyTasks,
  getTasksByProject,
  getSingleTask,
  updateTask,
  deleteTask,
};
