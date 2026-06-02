import { Role } from "@prisma/client";
import prisma from "../../util/prisma";
import AppError from "../../Error/AppError";
import httpStatus from "http-status";
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

const getLoggedInUser = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
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

export const userServices = {
  getAllUsers,
  getLoggedInUser,
  handleUpdaeProfile,
};
