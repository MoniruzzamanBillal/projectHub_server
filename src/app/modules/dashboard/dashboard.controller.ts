import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { dashboardServices } from "./dashboard.service";

const getDashboardStats = catchAsync(async (req, res) => {
  const result = await dashboardServices.getDashboardStats();

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Dashboard stats retrieved successfully",
    data: result,
  });
});

export const dashboardController = { getDashboardStats };
