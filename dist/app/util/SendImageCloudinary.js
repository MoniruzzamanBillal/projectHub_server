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
exports.SendImageCloudinary = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dummy",
    api_key: process.env.CLOUDINARY_API_KEY || "dummy",
    api_secret: process.env.CLOUDINARY_API_SECRET || "dummy",
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        public_id: (_req, file) => `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    },
});
exports.upload = (0, multer_1.default)({ storage });
const SendImageCloudinary = (path, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.v2.uploader.upload(path, {
            public_id: name,
        });
        return {
            asset_id: result.asset_id,
            public_id: result.public_id,
            version: result.version,
            version_id: result.version_id,
            signature: result.signature,
            width: result.width,
            height: result.height,
            format: result.format,
            resource_type: result.resource_type,
            created_at: result.created_at,
            tags: result.tags,
            bytes: result.bytes,
            type: result.type,
            etag: result.etag,
            placeholder: result.placeholder,
            url: result.url,
            secure_url: result.secure_url,
            folder: result.folder,
            overwritten: result.overwritten,
            original_filename: result.original_filename,
            original_extension: result.original_extension,
            api_key: result.api_key,
        };
    }
    catch (_a) {
        return undefined;
    }
});
exports.SendImageCloudinary = SendImageCloudinary;
