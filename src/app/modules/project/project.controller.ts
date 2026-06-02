import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { projectServices } from "./project.service";

const createProject = catchAsync(async (req, res) => {
  const result = await projectServices.createProject(req.body, req.user.userId);

  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: "Project created successfully",
    data: result,
  });
});

const getAllProjects = catchAsync(async (req, res) => {
  const result = await projectServices.getAllProjects();

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Projects retrieved successfully",
    data: result,
  });
});

const getSingleProject = catchAsync(async (req, res) => {
  const result = await projectServices.getSingleProject(req.params.id);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Project retrieved successfully",
    data: result,
  });
});

const updateProject = catchAsync(async (req, res) => {
  const result = await projectServices.updateProject(
    req.params.id,
    req.body,
    req.user.userId,
  );

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Project updated successfully",
    data: result,
  });
});

const deleteProject = catchAsync(async (req, res) => {
  const result = await projectServices.deleteProject(req.params.id);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Project deleted successfully",
    data: result,
  });
});

const addMember = catchAsync(async (req, res) => {
  const result = await projectServices.addMember(
    req.params.id,
    req.body.userId,
  );

  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: "Member added successfully",
    data: result,
  });
});

const removeMember = catchAsync(async (req, res) => {
  const result = await projectServices.removeMember(
    req.params.id,
    req.params.memberId,
  );

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Member removed successfully",
    data: result,
  });
});

export const projectController = {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
