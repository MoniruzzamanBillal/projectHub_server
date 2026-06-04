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
exports.authServices = void 0;
const client_1 = require("@prisma/client");
const argon2_1 = __importDefault(require("argon2"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
const SendImageCloudinary_1 = require("../../util/SendImageCloudinary");
const auth_util_1 = require("./auth.util");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!payload.name || !payload.email || !payload.password) {
        throw new Error("Missing required fields: name, email, or password");
    }
    const hashedPassword = yield argon2_1.default.hash(payload.password);
    const userData = yield prisma_1.default.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            passwordHash: hashedPassword,
            role: (_a = payload.role) !== null && _a !== void 0 ? _a : client_1.Role.TEAM_MEMBER,
        },
    });
    return userData;
});
const updateUser = (payload, file, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist");
    }
    if (file) {
        const name = userData.name.trim();
        const path = file.path.trim();
        const cloudinaryResponse = yield (0, SendImageCloudinary_1.SendImageCloudinary)(path, name);
        payload.avatarUrl = cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.secure_url;
    }
    const result = yield prisma_1.default.user.update({
        where: { id: userId },
        data: payload,
    });
    return result;
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist");
    }
    const isPasswordMatch = yield argon2_1.default.verify(user.passwordHash, payload.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password doesn't match");
    }
    const jwtPayload = {
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
    };
    const token = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_secret);
    return { user, token };
});
const deleteUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield prisma_1.default.user.findUnique({
        where: { id: payload.userId },
    });
    if (!userExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist");
    }
    const result = yield prisma_1.default.user.delete({
        where: { id: payload.userId },
    });
    return result;
});
exports.authServices = {
    createUser,
    login,
    updateUser,
    deleteUser,
};
