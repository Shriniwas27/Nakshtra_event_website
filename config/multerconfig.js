import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";  
import cloudinary from "./cloudinary.js";
import dotenv from 'dotenv';
dotenv.config();


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
  

    return {
      folder: "uploads",
      format: "png",
      public_id: file.originalname.split(".")[0],
    };
  },
});

export const upload = multer({ storage });

