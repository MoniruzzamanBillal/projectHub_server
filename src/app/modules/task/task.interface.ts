import { TaskPriority, TaskStatus } from "@prisma/client";

export type TCreateTask = {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  projectId: string;
  assigneeId: string;
};

export type TUpdateTask = {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigneeId?: string;
};
