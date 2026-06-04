"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../util/catchAsync"));
const sendResponse_1 = __importDefault(require("../../util/sendResponse"));
const activityLog_service_1 = require("./activityLog.service");
const getAllActivityLogs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { action, userId, projectId } = req.query;
    const result = yield activityLog_service_1.activityLogServices.getAllActivityLogs({
        action: action,
        userId: userId,
        projectId: projectId,
    });
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Activity logs retrieved successfully",
        data: result,
    });
}));
const getActivityLogsByProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield activityLog_service_1.activityLogServices.getActivityLogsByProject(req.params.projectId);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Activity logs retrieved successfully",
        data: result,
    });
}));
const getActivityLogsByTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield activityLog_service_1.activityLogServices.getActivityLogsByTask(req.params.taskId);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Activity logs retrieved successfully",
        data: result,
    });
}));
const getActivityLogsByUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield activityLog_service_1.activityLogServices.getActivityLogsByUser(req.params.userId);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Activity logs retrieved successfully",
        data: result,
    });
}));
const getSingleActivityLog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield activityLog_service_1.activityLogServices.getSingleActivityLog(req.params.id);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Activity log retrieved successfully",
        data: result,
    });
}));
exports.activityLogController = {
    getAllActivityLogs,
    getActivityLogsByProject,
    getActivityLogsByTask,
    getActivityLogsByUser,
    getSingleActivityLog,
};
