// import httpStatus from "http-status";
// import catchAsync from "../../util/catchAsync";
// import sendResponse from "../../util/sendResponse";
// import { activityLogServices } from "./activityLog.service";

// const getAllActivityLogs = catchAsync(async (req, res) => {
//   const result = await activityLogServices.getAllActivityLogs();

//   sendResponse(res, {
//     status: httpStatus.OK,
//     success: true,
//     message: "Activity logs retrieved successfully",
//     data: result,
//   });
// });

// const getActivityLogsByProject = catchAsync(async (req, res) => {
//   const result = await activityLogServices.getActivityLogsByProject(
//     req.params.projectId,
//   );

//   sendResponse(res, {
//     status: httpStatus.OK,
//     success: true,
//     message: "Activity logs retrieved successfully",
//     data: result,
//   });
// });

// const getActivityLogsByTask = catchAsync(async (req, res) => {
//   const result = await activityLogServices.getActivityLogsByTask(
//     req.params.taskId,
//   );

//   sendResponse(res, {
//     status: httpStatus.OK,
//     success: true,
//     message: "Activity logs retrieved successfully",
//     data: result,
//   });
// });

// const getActivityLogsByUser = catchAsync(async (req, res) => {
//   const result = await activityLogServices.getActivityLogsByUser(
//     req.params.userId,
//   );

//   sendResponse(res, {
//     status: httpStatus.OK,
//     success: true,
//     message: "Activity logs retrieved successfully",
//     data: result,
//   });
// });

// const getSingleActivityLog = catchAsync(async (req, res) => {
//   const result = await activityLogServices.getSingleActivityLog(req.params.id);

//   sendResponse(res, {
//     status: httpStatus.OK,
//     success: true,
//     message: "Activity log retrieved successfully",
//     data: result,
//   });
// });

// export const activityLogController = {
//   getAllActivityLogs,
//   getActivityLogsByProject,
//   getActivityLogsByTask,
//   getActivityLogsByUser,
//   getSingleActivityLog,
// };
