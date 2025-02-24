import express from "express";
import { signUp,login,addAdmin,addImage,voteImage } from "../controllers/usercontroller.js";
import auth from "../middlewares/auth.js";
import { upload } from "../config/multerconfig.js";


const router=express.Router();

router.post("/signup",signUp);
router.post("/login",login);
router.post("/admin",auth,addAdmin);
router.post("/image", upload.single("image"),addImage);
router.post("/vote/:id",auth,voteImage);


export default router;