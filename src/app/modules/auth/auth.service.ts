import { Role } from "@prisma/client";
import argon2 from "argon2";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../Error/AppError";
import { IFile } from "../../interface/file";
import prisma from "../../util/prisma";

import { SendImageCloudinary } from "../../util/SendImageCloudinary";
import { TLogin } from "../user/user.interface";
import { createToken } from "./auth.util";

const createUser = async (payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) => {
  if (!payload.name || !payload.email || !payload.password) {
    throw new Error("Missing required fields: name, email, or password");
  }

  const hashedPassword = await argon2.hash(payload.password);

  const userData = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      passwordHash: hashedPassword,

      role: (payload.role as Role) ?? Role.TEAM_MEMBER,
    },
  });

  return userData;
};

const updateUser = async (
  payload: { name?: string; email?: string; avatarUrl?: string },
  file: Partial<IFile> | undefined,
  userId: string,
) => {
  const userData = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userData) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist");
  }

  if (file) {
    const name = userData.name.trim();
    const path = (file.path as string).trim();

    const cloudinaryResponse = await SendImageCloudinary(path, name);
    payload.avatarUrl = cloudinaryResponse?.secure_url;
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: payload,
  });

  return result;
};

const login = async (payload: TLogin) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist");
  }

  const isPasswordMatch = await argon2.verify(
    user.passwordHash,
    payload.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, "Password doesn't match");
  }

  const jwtPayload = {
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
  };

  const token = createToken(jwtPayload, config.jwt_secret as string);

  return { user, token };
};

const deleteUser = async (payload: { userId: string }) => {
  const userExist = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!userExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist");
  }

  const result = await prisma.user.delete({
    where: { id: payload.userId },
  });

  return result;
};

export const authServices = {
  createUser,
  login,
  updateUser,
  deleteUser,
};
