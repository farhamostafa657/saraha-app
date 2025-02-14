import cloudinary from "../services/cloudinaryconfig.js";

export const uploadToCloudinary = (fileBufer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBufer);
  });
};
