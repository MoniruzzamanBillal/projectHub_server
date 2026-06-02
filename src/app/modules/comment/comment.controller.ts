import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { commentServices } from "./comment.service";

const createComment = catchAsync(async (req, res) => {
  const result = await commentServices.createComment(req.body, req.user.userId);

  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: "Comment created successfully",
    data: result,
  });
});

const getCommentsByTask = catchAsync(async (req, res) => {
  const result = await commentServices.getCommentsByTask(req.params.taskId);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Comments retrieved successfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const result = await commentServices.deleteComment(
    req.params.id,
    req.user.userId,
    req.user.userRole,
  );

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Comment deleted successfully",
    data: result,
  });
});

export const commentController = {
  createComment,
  getCommentsByTask,
  deleteComment,
};
