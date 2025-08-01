import { v2 as cloudinary } from "cloudinary";
import fs, { PathLike } from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRETE,
});

const uploadFileOnCloudinary = async (localFilePath?: string) => {
  try {
    if (!localFilePath) return null;
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
    fs.unlinkSync(localFilePath as PathLike);
    return response;
  } catch (e) {
    console.log(e);
    console.log("I am gone to here sir");
    fs.unlinkSync(localFilePath as PathLike);
    return null;
  }
}

export default uploadFileOnCloudinary;