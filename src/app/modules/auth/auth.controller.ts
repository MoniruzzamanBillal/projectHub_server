import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { authServices } from "./auth.service";

const crateUser = catchAsync(async (req, res) => {
  const result = await authServices.createUser(req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const result = await authServices.updateUser(
    req.body,
    req.file,
    req.user?.userId,
  );

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const signIn = catchAsync(async (req, res) => {
  const result = await authServices.login(req.body);

  const { user, token } = result;

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: user,
    token: token,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const result = await authServices.deleteUser(req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const authController = {
  crateUser,
  signIn,
  updateUser,
  deleteUser,
};
