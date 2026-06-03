import { Role } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";
import { TUser } from "./user.interface";

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: {
        in: [Role.TEAM_MEMBER, Role.PROJECT_MANAGER],
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return result;
};

const getAllUsersForTeam = async () => {
  const result = await prisma.user.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return result;
};

const getLoggedInUser = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,

      role: true,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist");
  }

  return result;
};

const handleUpdaeProfile = async (payload: Partial<TUser>, userId: string) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: payload,
  });

  return result;
};

const updateUserRole = async (
  targetUserId: string,
  newRole: Role,
  actingUserId: string,
) => {
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (targetUser.id === actingUserId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot change your own role",
    );
  }

  if (targetUser.role === Role.ADMIN) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot change another admin's role",
    );
  }

  const actingUser = await prisma.user.findUnique({
    where: { id: actingUserId },
  });

  const result = await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "USER_ROLE_CHANGED",
      description: `${actingUser?.name ?? "Admin"} changed role of ${targetUser.name} from ${targetUser.role} to ${newRole}`,
      userId: actingUserId,
    },
  });

  return result;
};

export const userServices = {
  getAllUsers,
  getAllUsersForTeam,
  getLoggedInUser,
  handleUpdaeProfile,
  updateUserRole,
};
