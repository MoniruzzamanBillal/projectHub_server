import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";
import { TCreateProject, TUpdateProject } from "./project.interface";

const createProject = async (payload: TCreateProject, ownerId: string) => {
  const result = await prisma.project.create({
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

  return result;
};

const getAllProjects = async () => {
  const result = await prisma.project.findMany({
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
};

const getSingleProject = async (projectId: string) => {
  const result = await prisma.project.findUnique({
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
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  return result;
};

const updateProject = async (
  projectId: string,
  payload: TUpdateProject,
  userId: string,
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  if (project?.ownerId !== userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This user is not owner of this Project",
    );
  }

  const result = await prisma.project.update({
    where: { id: projectId },
    data: {
      ...payload,
      deadline: payload.deadline ? new Date(payload.deadline) : undefined,
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return result;
};

const deleteProject = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return { message: "Project deleted successfully" };
};

const addMember = async (projectId: string, userId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const existingMembership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });

  if (existingMembership) {
    throw new AppError(httpStatus.CONFLICT, "User is already a member");
  }

  const result = await prisma.projectMember.create({
    data: { projectId, userId },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  return result;
};

const removeMember = async (projectId: string, userId: string) => {
  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });

  if (!membership) {
    throw new AppError(httpStatus.NOT_FOUND, "Membership not found");
  }

  await prisma.projectMember.delete({
    where: { projectId_userId: { projectId, userId } },
  });

  return { message: "Member removed successfully" };
};

export const projectServices = {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
