import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { userServices } from "./user.service";

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userServices.getAllUsers();

  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: "User Retrived successfully!!!",
    data: result,
  });
});

const getAllUsersForTeam = catchAsync(async (req, res) => {
  const result = await userServices.getAllUsersForTeam();

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Team members retrieved successfully",
    data: result,
  });
});

// ! get logged in user
const getLoggedInUser = catchAsync(async (req, res) => {
  const result = await userServices.getLoggedInUser(req.user?.userId);

  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: "User Retrived successfully!!!",
    data: result,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const result = await userServices.updateUserRole(
    userId,
    role,
    req.user.userId,
  );

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

//
export const userController = {
  getAllUsers,
  getAllUsersForTeam,
  getLoggedInUser,
  updateUserRole,
};
