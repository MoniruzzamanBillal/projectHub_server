import { ActivityAction } from "@prisma/client";

export type TCreateActivityLog = {
  action: ActivityAction;
  description: string;
  userId: string;
  projectId?: string;
  taskId?: string;
  metadata?: Record<string, unknown>;
};
