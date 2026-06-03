import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { taskServices } from "./task.service";

const createTask = catchAsync(async (req, res) => {
  const result = await taskServices.createTask(req.body, req.user.userId);

  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: "Task created successfully",
    data: result,
  });
});

const getAllTasks = catchAsync(async (req, res) => {
  const { searchTerm, status, priority } = req.query;

  const result = await taskServices.getAllTasks({
    searchTerm: searchTerm as string | undefined,
    status: status as string | undefined,
    priority: priority as string | undefined,
  });

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Tasks retrieved successfully",
    data: result,
  });
});

const getMyTasks = catchAsync(async (req, res) => {
  const { searchTerm, status, priority } = req.query;

  const result = await taskServices.getMyTasks(req.user.userId, {
    searchTerm: searchTerm as string | undefined,
    status: status as string | undefined,
    priority: priority as string | undefined,
  });

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "My tasks retrieved successfully",
    data: result,
  });
});

const getTasksByProject = catchAsync(async (req, res) => {
  const result = await taskServices.getTasksByProject(req.params.projectId);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Tasks retrieved successfully",
    data: result,
  });
});

const getSingleTask = catchAsync(async (req, res) => {
  const result = await taskServices.getSingleTask(req.params.id);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Task retrieved successfully",
    data: result,
  });
});

const updateTask = catchAsync(async (req, res) => {
  const result = await taskServices.updateTask(
    req.params.id,
    req.body,
    req.user.userId,
    req.user.userRole,
  );

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Task updated successfully",
    data: result,
  });
});

const deleteTask = catchAsync(async (req, res) => {
  const result = await taskServices.deleteTask(req.params.id, req.user.userId);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Task deleted successfully",
    data: result,
  });
});

export const taskController = {
  createTask,
  getAllTasks,
  getMyTasks,
  getTasksByProject,
  getSingleTask,
  updateTask,
  deleteTask,
};
