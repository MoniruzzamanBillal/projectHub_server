import { ProjectStatus } from "@prisma/client";

export type TCreateProject = {
  name: string;
  description?: string;
  deadline?: string;
  status?: ProjectStatus;
};

export type TUpdateProject = {
  name?: string;
  description?: string;
  deadline?: string;
  status?: ProjectStatus;
};
