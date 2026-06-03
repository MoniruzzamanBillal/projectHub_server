import prisma from "../../util/prisma";

const getDashboardStats = async () => {
  const totalProjects = await prisma.project.count();
  const activeProjects = await prisma.project.count({
    where: { status: "ACTIVE" },
  });
  const totalTasks = await prisma.task.count();

  const completedTasks = await prisma.task.count({
    where: { status: "COMPLETED" },
  });

  const overdueTasks = await prisma.task.count({
    where: {
      dueDate: { lt: new Date() },
      status: { not: "COMPLETED" },
    },
  });

  const teamMembers = await prisma.user.count();

  const priorityDistribution = await prisma.task.groupBy({
    by: ["priority"],
    _count: true,
  });

  const tasksByAssignee = await prisma.task.groupBy({
    by: ["assigneeId"],
    _count: true,
  });

  const assigneeIds = tasksByAssignee.map((t) => t.assigneeId);
  const users = await prisma.user.findMany({
    where: { id: { in: assigneeIds } },
    select: { id: true, name: true },
  });

  const userTaskMap = new Map(users.map((u) => [u.id, u.name]));
  const maxTasks = Math.max(...tasksByAssignee.map((t) => t._count), 1);

  const teamWorkload = tasksByAssignee.map((t) => ({
    name: userTaskMap.get(t.assigneeId) ?? "Unknown",
    tasks: t._count,
    percentage: Math.round((t._count / maxTasks) * 100),
  }));

  return {
    kpis: {
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
      teamMembers,
    },
    priorityDistribution: priorityDistribution.map((p) => ({
      priority: p.priority,
      count: p._count,
    })),
    teamWorkload,
  };
};

export const dashboardServices = { getDashboardStats };
