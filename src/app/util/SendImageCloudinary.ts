import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { ICloudinaryResponse } from "../interface/file";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dummy",
  api_key: process.env.CLOUDINARY_API_KEY || "dummy",
  api_secret: process.env.CLOUDINARY_API_SECRET || "dummy",
});

const storage = new CloudinaryStorage({
  cloudinary,
    params: {
    public_id: (_req: any, file: any) =>
      `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
  } as any,
});

export const upload = multer({ storage });

export const SendImageCloudinary = async (
  path: string,
  name: string,
): Promise<ICloudinaryResponse | undefined> => {
  try {
    const result = await cloudinary.uploader.upload(path, {
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
  } catch {
    return undefined;
  }
};
