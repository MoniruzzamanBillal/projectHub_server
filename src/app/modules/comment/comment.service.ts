import { Role } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";
import { TCreateComment } from "./comment.interface";

const createComment = async (payload: TCreateComment, authorId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: payload.taskId },
  });

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  const result = await prisma.comment.create({
    data: {
      content: payload.content,
      taskId: payload.taskId,
      authorId,
    },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "COMMENT_ADDED",
      description: `Comment added to task "${task.title}"`,
      userId: authorId,
      projectId: task.projectId,
      taskId: payload.taskId,
    },
  });

  return result;
};

const getCommentsByTask = async (taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  const result = await prisma.comment.findMany({
    where: { taskId },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const deleteComment = async (commentId: string, userId: string, userRole: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  if (userRole === Role.TEAM_MEMBER && comment.authorId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only delete your own comments",
    );
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return { message: "Comment deleted successfully" };
};

export const commentServices = {
  createComment,
  getCommentsByTask,
  deleteComment,
};
