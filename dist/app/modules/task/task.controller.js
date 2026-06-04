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
exports.taskController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../util/catchAsync"));
const sendResponse_1 = __importDefault(require("../../util/sendResponse"));
const task_service_1 = require("./task.service");
const createTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_service_1.taskServices.createTask(req.body, req.user.userId);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.CREATED,
        success: true,
        message: "Task created successfully",
        data: result,
    });
}));
const getAllTasks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, status, priority } = req.query;
    const result = yield task_service_1.taskServices.getAllTasks({
        searchTerm: searchTerm,
        status: status,
        priority: priority,
    });
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Tasks retrieved successfully",
        data: result,
    });
}));
const getMyTasks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, status, priority } = req.query;
    const result = yield task_service_1.taskServices.getMyTasks(req.user.userId, {
        searchTerm: searchTerm,
        status: status,
        priority: priority,
    });
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "My tasks retrieved successfully",
        data: result,
    });
}));
const getTasksByProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_service_1.taskServices.getTasksByProject(req.params.projectId);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Tasks retrieved successfully",
        data: result,
    });
}));
const getSingleTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_service_1.taskServices.getSingleTask(req.params.id);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Task retrieved successfully",
        data: result,
    });
}));
const updateTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_service_1.taskServices.updateTask(req.params.id, req.body, req.user.userId, req.user.userRole);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Task updated successfully",
        data: result,
    });
}));
const deleteTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield task_service_1.taskServices.deleteTask(req.params.id, req.user.userId);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Task deleted successfully",
        data: result,
    });
}));
exports.taskController = {
    createTask,
    getAllTasks,
    getMyTasks,
    getTasksByProject,
    getSingleTask,
    updateTask,
    deleteTask,
};
