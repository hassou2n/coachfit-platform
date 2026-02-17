import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadVideoToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(new Error("No video buffer provided"));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "courses",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
