import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";  
import { getCloudinaryInstance } from "./cloudinary.js";
import dotenv from "dotenv";

dotenv.config();


const storage = new CloudinaryStorage({
  cloudinary: await getCloudinaryInstance(),
  params: async (req, file) => {
    return {
      folder: "uploads",
      format: "png",
      public_id: file.originalname.split(".")[0],
    };
  },
});

export const upload = multer({ storage });




