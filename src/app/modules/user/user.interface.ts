import { Role } from "@prisma/client";

export type TUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;

  role: Role;
};

export type TLogin = {
  email: string;
  password: string;
};
